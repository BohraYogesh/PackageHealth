import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import analysisRoutes from './routes/analysisRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { env } from './config/env.js';
const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin.split(',').map((v) => v.trim()),
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }),
);
app.use(express.json({ limit: `${Math.ceil(env.maxBytes / 1024)}kb` }));
app.use(
  '/api',
  rateLimit({
    windowMs: env.rateWindowMs,
    limit: env.rateMax,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
      error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again shortly.' },
    },
  }),
);
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', service: 'PackageHealth API', timestamp: new Date().toISOString() }),
);
app.use('/api/analyze', analysisRoutes);
app.use((_req, res) =>
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Endpoint not found.' } }),
);
app.use(errorHandler);
app.listen(env.port, () =>
  console.log(`PackageHealth API listening on http://localhost:${env.port}`),
);
export default app;
