import axios from 'axios';
import semver from 'semver';
import { env } from '../config/env.js';
const osv = axios.create({
  baseURL: 'https://api.osv.dev/v1',
  timeout: env.timeoutMs,
  headers: { 'Content-Type': 'application/json' },
});
const batches = (items, size) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, (i + 1) * size),
  );
export async function getVulnerabilityResults(dependencies) {
  const exact = dependencies.filter((dep) => dep.isExact && dep.declaredVersion);
  const keyFor = (dep) => `${dep.name}@${dep.declaredVersion}`;
  const results = new Map(
    dependencies.map((dep) => [
      keyFor(dep),
      {
        status: 'unknown',
        count: 0,
        vulnerabilities: [],
        message: dep.isExact
          ? 'Waiting for OSV scan.'
          : 'A package.json range is not an installed version. Provide a lockfile for resolved-version scanning.',
      },
    ]),
  );
  for (const batch of batches(exact, 100)) {
    try {
      const { data } = await osv.post('/querybatch', {
        queries: batch.map((dep) => ({
          package: { name: dep.name, ecosystem: 'npm' },
          version: semver.valid(dep.declaredVersion) || dep.declaredVersion,
        })),
      });
      (data.results || []).forEach((result, index) => {
        const dep = batch[index];
        const vulns = (result.vulns || []).map((v) => ({
          id: v.id,
          summary: v.summary || v.details?.slice(0, 220) || 'Known vulnerability',
          aliases: v.aliases || [],
          modified: v.modified || null,
          references: (v.references || []).slice(0, 3).map((r) => r.url),
        }));
        results.set(keyFor(dep), {
          status: 'scanned',
          count: vulns.length,
          vulnerabilities: vulns,
          message: null,
        });
      });
      // A short OSV response is treated as unknown for unmatched entries, not as a clean scan.
      batch
        .slice(data.results?.length || 0)
        .forEach((dep) =>
          results.set(keyFor(dep), {
            status: 'unavailable',
            count: 0,
            vulnerabilities: [],
            message: 'OSV returned an incomplete response.',
          }),
        );
    } catch {
      batch.forEach((dep) =>
        results.set(keyFor(dep), {
          status: 'unavailable',
          count: 0,
          vulnerabilities: [],
          message: 'OSV could not be reached. Vulnerability status is unknown, not safe.',
        }),
      );
    }
  }
  return results;
}
