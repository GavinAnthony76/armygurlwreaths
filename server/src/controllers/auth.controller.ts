import type { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';
import { env } from '../config/env.js';

const REFRESH_COOKIE = 'agw_refresh';
const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  domain: env.COOKIE_DOMAIN,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const authController = {
  async register(req: Request, res: Response) {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
    res.status(201).json({
      success: true,
      data: {
        user: sanitizeUser(user),
        accessToken,
      },
    });
  },

  async login(req: Request, res: Response) {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
    res.json({
      success: true,
      data: {
        user: sanitizeUser(user),
        accessToken,
      },
    });
  },

  async logout(_req: Request, res: Response) {
    res.clearCookie(REFRESH_COOKIE, { domain: env.COOKIE_DOMAIN });
    res.json({ success: true, message: 'Logged out successfully' });
  },

  async refresh(req: Request, res: Response) {
    const token = req.cookies[REFRESH_COOKIE];
    if (!token) {
      res.status(401).json({ success: false, message: 'No refresh token' });
      return;
    }
    const { user, accessToken, refreshToken } = await authService.refreshTokens(token);
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
    res.json({
      success: true,
      data: { user: sanitizeUser(user), accessToken },
    });
  },

  async me(req: Request, res: Response) {
    const user = await authService.getById(req.user!.sub);
    res.json({ success: true, data: sanitizeUser(user) });
  },

  async updateMe(req: Request, res: Response) {
    const updated = await authService.updateProfile(req.user!.sub, req.body);
    res.json({ success: true, data: sanitizeUser(updated) });
  },
};

function sanitizeUser(user: Record<string, unknown>) {
  const { passwordHash: _, ...safe } = user;
  return safe;
}
