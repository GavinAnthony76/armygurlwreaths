import type { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/AppError.js';

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    return next(new UnauthorizedError());
  }
  if (req.user.role !== 'admin') {
    return next(new ForbiddenError('Admin access required'));
  }
  next();
}
