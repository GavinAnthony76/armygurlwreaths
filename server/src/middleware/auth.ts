import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { UnauthorizedError } from '../utils/AppError.js';
import type { AuthTokenPayload } from '@armygurl/shared';

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return next(new UnauthorizedError('No access token provided'));
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired access token'));
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token) {
    try {
      req.user = verifyAccessToken(token);
    } catch {
      // ignore invalid tokens for optional auth
    }
  }
  next();
}
