export const APP_CONFIG = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  maxManifestBytes: 256 * 1024,
  historyLimit: 20,
};
