import { describe, expect, it, vi } from 'vitest';
import { validateAnalysis } from '../../server/middleware/validateAnalysis.js';
describe('validateAnalysis middleware', () => {
  const invoke = (packageJson) => {
    const req = { body: { packageJson } };
    const next = vi.fn();
    validateAnalysis(req, {}, next);
    return { req, next };
  };
  it('accepts a manifest with dependencies', () => {
    const { req, next } = invoke('{"dependencies":{"react":"^18.0.0"}}');
    expect(next).toHaveBeenCalledWith();
    expect(req.packageManifest.dependencies.react).toBe('^18.0.0');
  });
  it('rejects malformed JSON', () => {
    const { next } = invoke('{broken');
    expect(next.mock.calls[0][0].code).toBe('INVALID_JSON');
  });
  it('rejects manifests without dependencies', () => {
    const { next } = invoke('{"name":"empty"}');
    expect(next.mock.calls[0][0].code).toBe('NO_DEPENDENCIES');
  });
});
