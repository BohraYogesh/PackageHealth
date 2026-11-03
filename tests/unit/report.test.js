import { describe, expect, it } from 'vitest';
import { filterDependencies, toCsv } from '../../src/utils/report.js';
const dependencies = [
  {
    name: 'react',
    declaredVersion: '^18.0.0',
    latestVersion: '19.0.0',
    wantedVersion: '18.3.1',
    dependencyType: 'production',
    updateStatus: 'outdated',
    deprecated: false,
    vulnerability: { status: 'unknown', count: 0 },
    packageUrl: 'https://www.npmjs.com/package/react',
  },
  {
    name: 'lodash',
    declaredVersion: '4.17.21',
    latestVersion: '4.17.21',
    wantedVersion: '4.17.21',
    dependencyType: 'production',
    updateStatus: 'current',
    deprecated: false,
    vulnerability: { status: 'scanned', count: 1 },
    packageUrl: 'https://www.npmjs.com/package/lodash',
  },
];
describe('filterDependencies', () => {
  it('filters by package name', () =>
    expect(filterDependencies(dependencies, 'all', 'rea')).toHaveLength(1));
  it('filters vulnerable packages', () =>
    expect(filterDependencies(dependencies, 'vulnerable', '')[0].name).toBe('lodash'));
  it('keeps unknown distinct from safe', () =>
    expect(filterDependencies(dependencies, 'unknown', '')[0].name).toBe('react'));
});
describe('toCsv', () => {
  it('exports dependency rows and escapes quotes', () => {
    const csv = toCsv({ dependencies: [{ ...dependencies[0], name: 'a"b' }] });
    expect(csv).toContain('"a""b"');
    expect(csv.split('\r\n')).toHaveLength(2);
  });
});
