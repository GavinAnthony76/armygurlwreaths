import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthTokenPayload, UserRole } from '@armygurl/shared';

export function signAccessToken(payload: { sub: string; email: string; role: UserRole }): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function signRefreshToken(payload: { sub: string }): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthTokenPayload;
}

export function verifyRefreshToken(token: string): { sub: string; iat: number; exp: number } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string; iat: number; exp: number };
}
