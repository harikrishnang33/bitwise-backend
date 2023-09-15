import { Credentials } from 'google-auth-library';

export interface UserInput {
  email: string;
  name?: string;
  googleTokenData?: Credentials;
}
