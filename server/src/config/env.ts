import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001').transform(Number),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 chars'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'STRIPE_PUBLISHABLE_KEY is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),
  PAYPAL_CLIENT_ID: z.string().min(1, 'PAYPAL_CLIENT_ID is required'),
  PAYPAL_CLIENT_SECRET: z.string().min(1, 'PAYPAL_CLIENT_SECRET is required'),
  PAYPAL_MODE: z.enum(['sandbox', 'live']).default('sandbox'),
  BLOB_READ_WRITE_TOKEN: z.string().min(1, 'BLOB_READ_WRITE_TOKEN is required'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  EMAIL_FROM: z.string().email().default('orders@armygurlwreaths.com'),
  EMAIL_FROM_NAME: z.string().default('ArmyGurlWreaths'),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  API_URL: z.string().url().default('http://localhost:3001'),
  COOKIE_DOMAIN: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
  RATE_LIMIT_MAX: z.string().default('100').transform(Number),
  ADMIN_EMAIL: z.string().email().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:');
  console.error(_env.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = _env.data;
export type Env = typeof env;
