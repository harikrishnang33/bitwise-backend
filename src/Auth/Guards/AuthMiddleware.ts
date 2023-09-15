// cookie-jwt-auth.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.jwt; // Assuming you're using the 'cookie-parser' middleware
    if (token) {
      try {
        const decoded = verify(token, process.env.JWT_SECRET); // Replace with your secret key
        // req['user'] = userContext; // Attach user context to the request object
        next();
      } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      res.status(401).json({ message: 'Token not provided' });
    }
  }
}
