import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { users } from '../db/schema/index.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { ConflictError, NotFoundError, UnauthorizedError } from '../utils/AppError.js';
import type { RegisterInput, LoginInput } from '@armygurl/shared';

export const authService = {
  async register(input: RegisterInput) {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, input.email.toLowerCase()),
    });
    if (existing) throw new ConflictError('An account with this email already exists');

    const passwordHash = await bcrypt.hash(input.password, 12);
    const [user] = await db.insert(users).values({
      email: input.email.toLowerCase(),
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      role: 'customer',
    }).returning();

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role as 'customer' | 'admin' });
    const refreshToken = signRefreshToken({ sub: user.id });

    return { user, accessToken, refreshToken };
  },

  async login(input: LoginInput) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, input.email.toLowerCase()),
    });
    if (!user) throw new UnauthorizedError('Invalid email or password');

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new UnauthorizedError('Invalid email or password');

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role as 'customer' | 'admin' });
    const refreshToken = signRefreshToken({ sub: user.id });

    return { user, accessToken, refreshToken };
  },

  async refreshTokens(refreshToken: string) {
    let payload: { sub: string };
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.sub),
    });
    if (!user) throw new NotFoundError('User');

    const newAccessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role as 'customer' | 'admin' });
    const newRefreshToken = signRefreshToken({ sub: user.id });

    return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  async getById(id: string) {
    const user = await db.query.users.findFirst({ where: eq(users.id, id) });
    if (!user) throw new NotFoundError('User');
    return user;
  },

  async updateProfile(id: string, data: Partial<{ firstName: string; lastName: string; phone: string }>) {
    const [updated] = await db.update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  },
};
