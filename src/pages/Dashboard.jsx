import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Package,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import MetricCard from '../components/dashboard/MetricCard.jsx';
import HealthChart, { getHealthDistribution } from '../components/charts/HealthChart.jsx';
import DependencyTable from '../components/analyzer/DependencyTable.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import { formatDate } from '../utils/format.js';
export default function Dashboard() {
  const { report } = useApp();
  if (!report)
    return (
      <div className="page-stack">
        <div className="page-intro">
          <div>
            <span className="eyebrow">PROJECT OVERVIEW</span>
            <h1>Dependency health</h1>
            <p>Your project’s dependency posture, at a glance.</p>
          </div>
        </div>
        <EmptyState
          title="No project analyzed yet"
          description="Start by uploading or pasting a package.json manifest."
          action={
            <Link className="button-primary" to="/analyzer">
              Open analyzer <ArrowRight size={15} />
            </Link>
          }
        />
      </div>
    );
  const s = report.summary;
  const distribution = getHealthDistribution(report.dependencies);
  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <span className="eyebrow">PROJECT OVERVIEW</span>
          <h1>Dependency health</h1>
          <p>
            Health snapshot for <b className="project-name">{report.project.name}</b> · analyzed{' '}
            {formatDate(report.analyzedAt)}
          </p>
        </div>
        <Link className="button-primary" to="/analyzer">
          New analysis <ArrowRight size={15} />
        </Link>
      </div>
      <section className="metric-grid">
        <MetricCard
          label="Total dependencies"
          value={s.total}
          detail="Across all dependency groups"
          icon={Package}
        />
        <MetricCard
          label="Up to date"
          value={s.current}
          detail={`${s.total ? Math.round((s.current / s.total) * 100) : 0}% of dependencies`}
          icon={CheckCircle2}
          tone="green"
        />
        <MetricCard
          label="Outdated"
          value={s.outdated}
          detail="Latest release is outside range"
          icon={TrendingUp}
          tone="amber"
        />
        <MetricCard
          label="Vulnerable"
          value={s.vulnerable}
          detail="Known OSV advisories found"
          icon={ShieldAlert}
          tone="red"
        />
      </section>
      <div className="dashboard-grid">
        <section className="panel health-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">HEALTH OVERVIEW</span>
              <h2>Dependency distribution</h2>
            </div>
            <StatusBadge
              status={
                s.healthScore >= 85 ? 'current' : s.healthScore >= 65 ? 'outdated' : 'vulnerable'
              }
            >
              {s.healthScore}/100 score
            </StatusBadge>
          </div>
          <div className="health-content">
            <HealthChart dependencies={report.dependencies} />
            <div className="chart-legend">
              <div>
                <i className="legend-green" /> Current <b>{distribution.current}</b>
              </div>
              <div>
                <i className="legend-amber" /> Outdated <b>{distribution.outdated}</b>
              </div>
              <div>
                <i className="legend-red" /> Vulnerable <b>{distribution.vulnerable}</b>
              </div>
              <div>
                <i className="legend-muted" /> Unknown <b>{distribution.unknown}</b>
              </div>
            </div>
          </div>
          <div className="health-footnote">
            <AlertCircle size={14} /> Score is a heuristic, not a security certification. Unknown
            vulnerability results reduce confidence.
          </div>
        </section>
        <section className="panel posture-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">DATA CONFIDENCE</span>
              <h2>Coverage & signals</h2>
            </div>
            <ShieldCheck size={19} className="subtle-icon" />
          </div>
          <div className="posture-stat">
            <span>Deprecated packages</span>
            <b>{s.deprecated}</b>
          </div>
          <div className="posture-stat">
            <span>Registry unavailable</span>
            <b>{s.unknownRegistry}</b>
          </div>
          <div className="posture-stat">
            <span>Vulnerability unknown</span>
            <b>{s.unknownVulnerability}</b>
          </div>
          <div className="confidence-note">{report.dataQuality.note}</div>
        </section>
      </div>
      <section className="panel dependencies-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">INVENTORY</span>
            <h2>Dependency details</h2>
          </div>
          <Link to="/reports" className="inline-link">
            Full report <ArrowRight size={14} />
          </Link>
        </div>
        <DependencyTable dependencies={report.dependencies.slice(0, 8)} />
        {report.dependencies.length > 8 && (
          <div className="table-more">
            <Link to="/reports">
              View all {report.dependencies.length} dependencies <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
