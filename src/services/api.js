import { APP_CONFIG } from '../config/app.js';
const API_BASE = APP_CONFIG.apiBaseUrl;
export async function analyzePackageJson(packageJson, { signal } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true });
  try {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageJson }),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new Error(payload.error?.message || `Analysis failed (${response.status}).`);
    return payload.data;
  } catch (error) {
    if (error.name === 'AbortError')
      throw new Error('The request timed out or was cancelled. Try a smaller manifest or retry.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
export async function getApiHealth() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) throw new Error('API unavailable');
  return response.json();
}
