import { Fragment, useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, ShieldAlert } from 'lucide-react';
import StatusBadge from '../common/StatusBadge.jsx';
function recommendation(dep) {
  if (dep.vulnerability.count > 0)
    return 'Review the linked OSV advisories and upgrade to a fixed release where available. Prioritize this package before routine version updates.';
  if (dep.deprecated)
    return 'Avoid adding new usage. Review the maintainer’s deprecation guidance and migrate to a supported alternative.';
  if (dep.updateStatus === 'outdated')
    return `Review the release notes and plan an update. The newest release satisfying this declared range is ${dep.wantedVersion || 'not available'}.`;
  if (dep.updateStatus === 'ahead')
    return 'The declared exact version is newer than the registry latest tag. Verify the package version and registry metadata.';
  if (dep.vulnerability.status === 'unknown' || dep.vulnerability.status === 'unavailable')
    return 'No security conclusion is available. Analyze a lockfile with resolved versions when lockfile support is available, and check the package advisories directly.';
  if (!dep.registryAvailable)
    return 'Registry metadata could not be retrieved. Retry the analysis before making an update decision.';
  return 'No immediate version action indicated by the available registry metadata. Keep monitoring releases and advisories.';
}
export default function DependencyTable({ dependencies }) {
  const [expanded, setExpanded] = useState('');
  if (!dependencies.length)
    return <div className="table-empty">No dependencies match these filters.</div>;
  return (
    <div className="table-scroll">
      <table className="dependency-table">
        <thead>
          <tr>
            <th>PACKAGE</th>
            <th>DECLARED</th>
            <th>WANTED</th>
            <th>LATEST</th>
            <th>TYPE</th>
            <th>STATUS</th>
            <th>SECURITY</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {dependencies.map((d) => {
            const key = `${d.name}-${d.dependencyType}-${d.declaredVersion}`;
            const isExpanded = expanded === key;
            return (
              <Fragment key={key}>
                <tr>
                  <td>
                    <div className="package-cell">
                      <b>{d.name}</b>
                      {d.deprecated && <span className="tiny-alert">DEPRECATED</span>}
                    </div>
                  </td>
                  <td className="mono">{d.declaredVersion}</td>
                  <td className="mono">{d.wantedVersion || '—'}</td>
                  <td className="mono">{d.latestVersion || '—'}</td>
                  <td>
                    <span className="type-label">{d.dependencyType}</span>
                  </td>
                  <td>
                    <StatusBadge status={d.updateStatus}>{d.updateStatus}</StatusBadge>
                  </td>
                  <td>
                    {d.vulnerability.count > 0 ? (
                      <span className="security-risk">
                        <ShieldAlert size={13} /> {d.vulnerability.count} issue
                        {d.vulnerability.count > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <StatusBadge status={d.vulnerability.status}>
                        {d.vulnerability.status === 'scanned' || d.vulnerability.status === 'clear'
                          ? 'No known issues'
                          : 'Unknown'}
                      </StatusBadge>
                    )}
                  </td>
                  <td>
                    <button
                      className="detail-toggle"
                      onClick={() => setExpanded(isExpanded ? '' : key)}
                      aria-label={`${isExpanded ? 'Hide' : 'Show'} details for ${d.name}`}
                    >
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr key={`${key}-details`} className="detail-row">
                    <td colSpan="8">
                      <div className="dependency-detail">
                        <div>
                          <span className="detail-label">ABOUT</span>
                          <p>
                            {d.description ||
                              'No package description is available from the registry.'}
                          </p>
                          {d.deprecationMessage && (
                            <p className="detail-warning">Deprecation: {d.deprecationMessage}</p>
                          )}
                        </div>
                        <div>
                          <span className="detail-label">RECOMMENDED ACTION</span>
                          <p>{recommendation(d)}</p>
                          {d.vulnerability.vulnerabilities?.length > 0 && (
                            <div className="vulnerability-list">
                              {d.vulnerability.vulnerabilities.map((v) => (
                                <div key={v.id}>
                                  <b>{v.id}</b>
                                  {v.summary && <span>{v.summary}</span>}
                                  {v.references?.[0] && (
                                    <a href={v.references[0]} target="_blank" rel="noreferrer">
                                      Advisory details <ExternalLink size={11} />
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {d.vulnerability.message && (
                            <p className="detail-muted">{d.vulnerability.message}</p>
                          )}
                          {d.registryError && <p className="detail-muted">{d.registryError}</p>}
                          <a
                            className="package-registry-link"
                            href={d.packageUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View on npm <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
