export function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
export function toCsv(report) {
  const columns = [
    'name',
    'declaredVersion',
    'latestVersion',
    'wantedVersion',
    'dependencyType',
    'updateStatus',
    'deprecated',
    'vulnerabilityStatus',
    'vulnerabilityCount',
    'packageUrl',
  ];
  const rows = report.dependencies.map((d) => [
    d.name,
    d.declaredVersion,
    d.latestVersion,
    d.wantedVersion,
    d.dependencyType,
    d.updateStatus,
    d.deprecated,
    d.vulnerability.status,
    d.vulnerability.count,
    d.packageUrl,
  ]);
  return [columns, ...rows]
    .map((row) => row.map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`).join(','))
    .join('\r\n');
}
export function filterDependencies(dependencies, filter, search) {
  const term = search.trim().toLowerCase();
  return dependencies.filter(
    (d) =>
      (!term || d.name.toLowerCase().includes(term)) &&
      (filter === 'all' ||
        (filter === 'vulnerable'
          ? d.vulnerability.count > 0
          : filter === 'unknown'
            ? d.vulnerability.status === 'unknown' || d.vulnerability.status === 'unavailable'
            : filter === 'deprecated'
              ? d.deprecated === true
              : filter === 'outdated'
                ? d.updateStatus === 'outdated'
                : d.updateStatus === filter)),
  );
}
