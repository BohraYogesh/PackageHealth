import { useMemo, useState } from 'react';
import { FileJson, Search, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { filterDependencies } from '../utils/report.js';
import ExportActions from '../components/reports/ExportActions.jsx';
import { formatDate } from '../utils/format.js';
import DependencyTable from '../components/analyzer/DependencyTable.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
export default function Reports() {
  const { report, history, setHistory } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const dependencies = useMemo(() => {
    if (!report) return [];
    return filterDependencies(report.dependencies, filter, search).sort((a, b) =>
      sort === 'name'
        ? a.name.localeCompare(b.name)
        : sort === 'version'
          ? (a.latestVersion || '').localeCompare(b.latestVersion || '')
          : a.updateStatus.localeCompare(b.updateStatus),
    );
  }, [report, filter, search, sort]);
  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <span className="eyebrow">EXPORT & HISTORY</span>
          <h1>Analysis reports</h1>
          <p>Search, filter and export the latest dependency report.</p>
        </div>
        {report && <ExportActions report={report} />}
      </div>
      {report ? (
        <>
          <section className="panel reports-panel">
            <div className="report-meta">
              <div>
                <b>{report.project.name}</b>
                <span>
                  {' '}
                  · {report.summary.total} dependencies · {formatDate(report.analyzedAt)}
                </span>
              </div>
              <span className="report-score">
                Health score <b>{report.summary.healthScore}/100</b>
              </span>
            </div>
            <div className="report-controls">
              <label className="search-box">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search packages…"
                />
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter dependencies"
              >
                <option value="all">All statuses</option>
                <option value="current">Current</option>
                <option value="outdated">Outdated</option>
                <option value="vulnerable">Vulnerable</option>
                <option value="deprecated">Deprecated</option>
                <option value="unknown">Unknown data</option>
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort dependencies"
              >
                <option value="name">Sort: package</option>
                <option value="version">Sort: latest version</option>
                <option value="status">Sort: status</option>
              </select>
            </div>
            <DependencyTable dependencies={dependencies} />
            <div className="table-footer">
              Showing {dependencies.length} of {report.dependencies.length} dependencies
            </div>
          </section>
          <div className="data-disclaimer">
            Vulnerability status is not a guarantee of safety. Exact-version checks use OSV; ranges
            and unavailable API results are marked unknown.
          </div>
        </>
      ) : (
        <EmptyState
          title="Your report is waiting"
          description="Run an analysis to generate a detailed, exportable dependency report."
        />
      )}
      <section className="panel history-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">LOCAL STORAGE</span>
            <h2>Recent analyses</h2>
          </div>
          <button
            className="text-button danger-text"
            disabled={!history.length}
            onClick={() => {
              if (window.confirm('Clear all locally saved analysis history?')) setHistory([]);
            }}
          >
            <Trash2 size={14} /> Clear history
          </button>
        </div>
        {history.length ? (
          <div className="history-list">
            {history.map((item) => (
              <div className="history-item" key={item.id}>
                <span className="history-icon">
                  <FileJson size={16} />
                </span>
                <div>
                  <b>{item.project}</b>
                  <small>{formatDate(item.analyzedAt)}</small>
                </div>
                <div className="history-counts">
                  <span>{item.summary.total} packages</span>
                  <b>{item.summary.healthScore}/100</b>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted-copy">
            No saved analyses yet. Reports are stored in this browser only.
          </p>
        )}
      </section>
    </div>
  );
}
