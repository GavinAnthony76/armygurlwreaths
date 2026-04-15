import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Express } from 'express';

// Import from the compiled server dist (built by `npm run build --workspace=server`).
// This avoids asking Vercel's bundler to resolve a long TypeScript import chain
// and makes the runtime behaviour identical to what was tested locally.
//
// Lazy singleton — app is created on the first request so that if env vars are
// missing the error surfaces as a JSON 500 body with a useful message rather
// than FUNCTION_INVOCATION_FAILED with no diagnostics.

let _app: Express | null = null;
let _initError: string | null = null;

async function getApp(): Promise<Express> {
  if (_initError) throw new Error(_initError);
  if (_app) return _app;

  try {
    const { createApp } = await import('../server/dist/index.js');
    _app = createApp();
    return _app;
  } catch (err) {
    _initError = err instanceof Error ? err.message : String(err);
    console.error('[api/index] initialization failed:', _initError);
    throw new Error(_initError);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const app = await getApp();
    app(req as never, res as never);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Initialization failed';
    console.error('[api/index] handler error:', message);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message,
        hint: 'Required Vercel env vars: DATABASE_URL, JWT_ACCESS_SECRET (32+ chars), JWT_REFRESH_SECRET (32+ chars), CLIENT_URL',
      });
    }
  }
}
