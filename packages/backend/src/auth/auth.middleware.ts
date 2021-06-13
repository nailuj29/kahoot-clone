import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../data/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private auth:  AuthService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization) {
      if (await this.auth.verifyToken(req.headers.authorization)) {
        req.authenticated = true;
        req.id = (await this.auth.getToken(req.headers.authorization).id) as string;
      } else {
        req.authenticated = false;
      }
    } else {
      req.authenticated = false;
    }

    next();
  }
}
