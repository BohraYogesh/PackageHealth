import { getPackageMetadata } from './registryService.js';
import { getVulnerabilityResults } from './osvService.js';
const GROUPS = [
  ['dependencies', 'production'],
  ['devDependencies', 'development'],
  ['optionalDependencies', 'optional'],
  ['peerDependencies', 'peer'],
];
const chunks = (items, size) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, (i + 1) * size),
  );
export async function analyzeManifest(manifest) {
  const entries = GROUPS.flatMap(([field, type]) =>
    Object.entries(manifest[field] || {}).map(([name, declaredVersion]) => ({
      name,
      declaredVersion,
      dependencyType: type,
      isExact: false,
    })),
  );
  const dependencies = [];
  for (const batch of chunks(entries, 8)) {
    const results = await Promise.all(
      batch.map(async (dep) => ({
        ...dep,
        ...(await getPackageMetadata(dep.name, dep.declaredVersion)),
      })),
    );
    dependencies.push(...results);
  }
  const vulnerabilityMap = await getVulnerabilityResults(dependencies);
  const enriched = dependencies.map((dep) => ({
    ...dep,
    vulnerability: vulnerabilityMap.get(`${dep.name}@${dep.declaredVersion}`) || {
      status: 'unknown',
      count: 0,
      vulnerabilities: [],
      message: 'No vulnerability result available.',
    },
  }));
  const count = (predicate) => enriched.filter(predicate).length;
  const scanned = enriched.filter((d) => ['scanned', 'clear'].includes(d.vulnerability.status));
  const vulnerable = count((d) => d.vulnerability.count > 0);
  const outdated = count((d) => d.updateStatus === 'outdated');
  const deprecated = count((d) => d.deprecated === true);
  const unknownRegistry = count((d) => !d.registryAvailable);
  const unknownVulnerability = count((d) => !['scanned', 'clear'].includes(d.vulnerability.status));
  const total = enriched.length;
  const riskPenalty = vulnerable * 18 + deprecated * 7 + outdated * 3 + unknownVulnerability * 1.5;
  const healthScore = Math.max(
    0,
    Math.min(100, Math.round(100 - (total ? riskPenalty / total : 0))),
  );
  return {
    project: { name: manifest.name || 'Untitled project', version: manifest.version || null },
    analyzedAt: new Date().toISOString(),
    summary: {
      total,
      current: count((d) => d.updateStatus === 'current'),
      outdated,
      vulnerable,
      deprecated,
      unknownRegistry,
      unknownVulnerability,
      scanned: scanned.length,
      healthScore,
    },
    dependencies: enriched,
    dataQuality: {
      registryUnavailable: unknownRegistry,
      vulnerabilityUnknown: unknownVulnerability,
      note: 'package.json declares version ranges, not necessarily installed versions. Vulnerability checks run only for exact semantic versions; lockfile-based resolution is planned.',
    },
  };
}
