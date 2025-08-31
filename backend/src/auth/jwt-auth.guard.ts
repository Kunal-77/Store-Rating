/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) return false;

    const token = authHeader.split(' ')[1];
    try {
      const secret = process.env.JWT_SECRET || 'defaultSecret';
      const decoded = jwt.verify(token, secret) as JwtPayload; // type assertion
      request.user = decoded; // attach user info
      return true;
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return false;
    }
  }
}
