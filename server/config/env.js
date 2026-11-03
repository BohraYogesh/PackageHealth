import 'dotenv/config';
export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  timeoutMs: Number(process.env.API_TIMEOUT_MS || 12000),
  maxBytes: Number(process.env.MAX_PACKAGE_JSON_BYTES || 262144),
  rateWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateMax: Number(process.env.RATE_LIMIT_MAX || 30),
};
