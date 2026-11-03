import axios from 'axios';
import semver from 'semver';
import { env } from '../config/env.js';
const registry = axios.create({
  baseURL: 'https://registry.npmjs.org',
  timeout: env.timeoutMs,
  headers: { Accept: 'application/vnd.npm.install-v1+json', 'User-Agent': 'PackageHealth/1.0' },
});
let consecutiveProviderFailures = 0;
let circuitOpenUntil = 0;
const FAILURE_THRESHOLD = 5;
const unavailable = (
  name,
  declaredSpec,
  message = 'npm Registry data is temporarily unavailable.',
) => ({
  latestVersion: null,
  wantedVersion: null,
  deprecated: null,
  deprecationMessage: null,
  description: '',
  homepage: null,
  repository: null,
  packageUrl: `https://www.npmjs.com/package/${name}`,
  updateStatus: 'unknown',
  registryAvailable: false,
  registryError: message,
  isExact: Boolean(semver.valid(declaredSpec)),
});
export async function getPackageMetadata(name, declaredSpec) {
  if (Date.now() < circuitOpenUntil)
    return unavailable(
      name,
      declaredSpec,
      'npm Registry requests are temporarily paused after repeated provider failures.',
    );
  try {
    const { data } = await registry.get(`/${encodeURIComponent(name).replace(/^%40/, '@')}`);
    consecutiveProviderFailures = 0;
    const latest = data['dist-tags']?.latest || null;
    const versions = Object.keys(data.versions || {}).filter((v) => semver.valid(v));
    const range = semver.validRange(declaredSpec);
    const wanted = range ? semver.maxSatisfying(versions, range) : null;
    const exact = semver.valid(declaredSpec);
    const isRange = Boolean(range && !exact);
    let status = 'unknown';
    if (latest && exact)
      status = semver.eq(exact, latest)
        ? 'current'
        : semver.lt(exact, latest)
          ? 'outdated'
          : 'ahead';
    else if (latest && isRange) status = semver.satisfies(latest, range) ? 'current' : 'outdated';
    return {
      latestVersion: latest,
      wantedVersion: wanted,
      deprecated: Boolean(data.versions?.[latest]?.deprecated || data.deprecated),
      deprecationMessage: data.versions?.[latest]?.deprecated || data.deprecated || null,
      description: data.description || '',
      homepage: data.homepage || null,
      repository:
        typeof data.repository === 'string' ? data.repository : data.repository?.url || null,
      packageUrl: `https://www.npmjs.com/package/${name}`,
      updateStatus: status,
      registryAvailable: true,
      registryError: null,
      isExact: Boolean(exact),
    };
  } catch (error) {
    const status = error.response?.status;
    if (!status || status >= 500) {
      consecutiveProviderFailures += 1;
      if (consecutiveProviderFailures >= FAILURE_THRESHOLD) {
        circuitOpenUntil = Date.now() + 30000;
        consecutiveProviderFailures = 0;
      }
    }
    return unavailable(
      name,
      declaredSpec,
      status === 404
        ? 'Package not found in the npm registry.'
        : 'npm Registry data is temporarily unavailable.',
    );
  }
}
