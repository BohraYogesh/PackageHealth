import { describe, expect, it, vi } from 'vitest';
vi.mock('../../server/services/registryService.js', () => ({
  getPackageMetadata: vi.fn(async (_name, spec) => ({
    latestVersion: '2.0.0',
    wantedVersion: '1.9.0',
    deprecated: false,
    description: '',
    homepage: null,
    repository: null,
    packageUrl: 'https://www.npmjs.com/package/pkg',
    updateStatus: spec === '2.0.0' ? 'current' : 'outdated',
    registryAvailable: true,
    registryError: null,
    isExact: spec === '2.0.0',
  })),
}));
vi.mock('../../server/services/osvService.js', () => ({
  getVulnerabilityResults: vi.fn(
    async (deps) =>
      new Map(
        deps.map((d) => [
          `${d.name}@${d.declaredVersion}`,
          {
            status: d.isExact ? 'scanned' : 'unknown',
            count: 0,
            vulnerabilities: [],
            message: null,
          },
        ]),
      ),
  ),
}));
import { analyzeManifest } from '../../server/services/analysisService.js';
describe('analysis service', () => {
  it('aggregates groups and preserves unknown vulnerability state for ranges', async () => {
    const result = await analyzeManifest({
      name: 'fixture',
      dependencies: { pkg: '^1.0.0' },
      devDependencies: { exact: '2.0.0' },
    });
    expect(result.summary.total).toBe(2);
    expect(result.summary.outdated).toBe(1);
    expect(result.dependencies.find((d) => d.name === 'pkg').vulnerability.status).toBe('unknown');
    expect(result.dependencies.find((d) => d.name === 'exact').dependencyType).toBe('development');
  });
});
