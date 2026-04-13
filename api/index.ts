// Vercel serverless entry point
// This file adapts the Express app for Vercel Functions
import '../server/src/config/env.js';
import { createApp } from '../server/src/index.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const app = createApp();

export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req as never, res as never);
}
