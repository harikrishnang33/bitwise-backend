import { Injectable, Logger } from '@nestjs/common';
import { docs_v1, drive_v3, google } from 'googleapis';
import { CreateDocDto } from '../Dtos/CreateDoc.dto';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { UserService } from '../../User/Services/UserService';
import TokenService from '../../Auth/Services/TokenService';
import { User } from '../../User/Entities/User';
import { DataSource, IsNull } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { GoogleDoc } from '../Entities/GoogleDoc';
import { isEmpty } from 'lodash';
import { GoogleTokenModel } from '../Models/GoogleTokenModel';
const HTMLtoDOCX = require('html-to-docx');

// Load the credentials JSON file you downloaded
const credentials = JSON.parse(
  `{"web":{"client_id":"849547651496-hmcu62nm6mis18tptl7ksq6gotdkrlia.apps.googleusercontent.com","project_id":"teambitwise","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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","redirect_uris":["http://localhost:3000/api/google/authenticate"],"javascript_origins":["http://localhost:3000"]}}`,
);

@Injectable()
export class GoogleService {
  private logger: Logger = new Logger(GoogleService.name);
  private docs: docs_v1.Docs; // Google Docs API client
  private drive: drive_v3.Drive; // Google Docs API client
  private oauth2Client: OAuth2Client;
  constructor(
    private readonly userService: UserService,
    private tokenService: TokenService,
    private readonly dataSource: DataSource,
  ) {
    // Create an OAuth2 client
    this.oauth2Client = new google.auth.OAuth2({
      clientId: credentials.web.client_id,
      clientSecret: credentials.web.client_secret,
      redirectUri: credentials.web.redirect_uris[0], // Redirect URI (if applicable)
    });

    google.options({ auth: this.oauth2Client });

    this.oauth2Client.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        // Store the refresh token in your database or wherever you need to persist it
        console.log(`Received refresh token: ${tokens.refresh_token}`);
        this.oauth2Client.setCredentials(tokens);
      }
      // console.log(`Access token: ${tokens.access_token}`);
    });
  }

  public async initiateAuthentication() {
    // Access scopes for read-only Drive activity.
    const scopes = [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];

    // Generate a url that asks permissions for the Drive activity scope
    const authorizationUrl = this.oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',
      /** Pass in the scopes array defined above.
       * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: scopes,
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true,
    });

    console.log(`auth url: ${authorizationUrl}`);
    return authorizationUrl;
  }

  public async authenticate(authCode: string) {
    const { tokens } = await this.oauth2Client.getToken(authCode); // the oauth2Client credentials will then be set by the "this.oauth2Client.on('tokens', (tokens)" event
    this.oauth2Client.setCredentials(tokens);
    let newTokens: Credentials;
    if (this.isAccessTokenExpired()) {
      newTokens = await this.setNewAccessToken(tokens);
    }

    const tokendata = await this.oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
    });
    const userInfo = tokendata.getPayload();

    let user = await this.userService.getUserByEmail(userInfo.email);

    if (!user) {
      this.logger.log(`User with email: ${userInfo.email} doesn't exist`);
      const userEntity = plainToClass(User, {
        email: userInfo.email,
        name: userInfo.email,
        googleTokenData: newTokens ?? tokens,
      });
      user = await this.userService.create(userEntity);
    } else {
      if (newTokens) {
        await this.userService.setGoogleToken(user.id, newTokens);
      }
    }
    this.updateUserIfInfoChanged(user, userInfo);

    return this.tokenService.generateAccessAndRefreshTokens(user.id);
  }

  updateUserIfInfoChanged(user: User, gTokenPayload: any) {
    if (user.name != gTokenPayload.name) {
      user.name = gTokenPayload.name;
      this.userService.updateUser(user);
    }
  }

  public async createDoc(input: CreateDocDto, userId: string) {
    // Initialize the Google Docs API client
    if (!this.docs) {
      this.instantiateDoc();
    }

    const user = await this.userService.getUserById(userId);

    if (!user?.googleTokenData) {
      throw new Error('User does not have google tokens');
    }

    // Set the credentials for the OAuth2 client
    this.oauth2Client.setCredentials(user.googleTokenData);

    if (this.isAccessTokenExpired()) {
      const newCredentials = await this.setNewAccessToken(user.googleTokenData);
      await this.userService.setGoogleToken(
        userId,
        newCredentials as GoogleTokenModel,
      );
    }

    const result = await this.docs.documents.create({
      requestBody: {
        title: input.name,
      },
    });

    if (result?.data?.documentId) {
      const docEntity = plainToClass(GoogleDoc, {
        googleId: result.data.documentId,
        workspaceId: input.workspaceId,
        name: input.name,
      });
      await this.dataSource.getRepository(GoogleDoc).save(docEntity);
    }
    return result;
  }

  public async getDocById(id: string, userId: string) {
    const doc = await this.dataSource
      .getRepository(GoogleDoc)
      .createQueryBuilder()
      .where({ id })
      .getOne();
    if (isEmpty(doc)) {
      throw new Error('Doc does not exist');
    }

    const user = await this.userService.getUserById(userId);

    if (!user?.googleTokenData) {
      throw new Error('User does not have google tokens');
    }

    // Set the credentials for the OAuth2 client
    this.oauth2Client.setCredentials(user.googleTokenData);

    if (this.isAccessTokenExpired()) {
      const newCredentials = await this.setNewAccessToken(user.googleTokenData);
      await this.userService.setGoogleToken(
        userId,
        newCredentials as GoogleTokenModel,
      );
    }

    if (!this.drive) {
      this.instantiateDrive();
    }

    const driveData = await this.drive.files.export({
      fileId: doc.googleId,
      mimeType: 'text/html',
    });

    return driveData.data;

    // const result = this.docs.documents.get({ documentId: doc.docId });

    // return result;
  }

  public async updateGoogleDoc(googleId: string, text: string, userId: string) {
    const doc = await this.dataSource
      .getRepository(GoogleDoc)
      .createQueryBuilder()
      .where({ googleId })
      .getOne();
    if (isEmpty(doc)) {
      throw new Error('Doc does not exist');
    }

    const user = await this.userService.getUserById(userId);

    if (!user?.googleTokenData) {
      throw new Error('User does not have google tokens');
    }

    // Set the credentials for the OAuth2 client
    this.oauth2Client.setCredentials(user.googleTokenData);

    if (this.isAccessTokenExpired()) {
      const newCredentials = await this.setNewAccessToken(user.googleTokenData);
      await this.userService.setGoogleToken(
        userId,
        newCredentials as GoogleTokenModel,
      );
    }

    if (!this.docs) {
      this.instantiateDoc();
    }

    const result = await this.docs.documents.batchUpdate({
      documentId: googleId,
      requestBody: {
        requests: [
          {
            insertText: {
              text,
              location: {
                index: 0, // Replace with the desired location
              },
            },
          },
        ],
      },
    });
    return result;
  }

  public async checkIfGoogleDocExistsInSystem(id: string) {
    const doc = await this.dataSource
      .getRepository(GoogleDoc)
      .createQueryBuilder()
      .where({ id })
      .getOne();
    return !isEmpty(doc);
  }


  public async getGoogleDocsByWorkspaceId(workspaceId: string) {
    return this.dataSource.getRepository(GoogleDoc)
      .createQueryBuilder(GoogleDoc.name)
      .where({workspaceId, deletedAt: IsNull()})
      .getMany();
  }

  private async setNewAccessToken(tokens: Credentials) {
    try {
      this.oauth2Client.setCredentials({ refresh_token: tokens.refresh_token });
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      this.oauth2Client.setCredentials(credentials);
      return credentials;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }

  private isAccessTokenExpired() {
    const tokenInfo = this.oauth2Client.credentials;
    if (!tokenInfo) return true;
    if (!tokenInfo.expiry_date) {
      return true; // Token has no expiration date
    }

    // Get the current time
    const currentTime = new Date().getTime();

    // Compare the current time with the token's expiration time
    const isExpired = tokenInfo.expiry_date <= currentTime;
    return isExpired;
  }

  private instantiateDoc() {
    this.docs = google.docs({
      version: 'v1', // Version of the Google Docs API
      auth: this.oauth2Client,
    });
  }

  private instantiateDrive() {
    this.drive = google.drive({
      version: 'v3',
      auth: this.oauth2Client,
    });
  }
}
