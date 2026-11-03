
export default function MetricCard({ label, value, detail, icon: Icon, tone = 'mint' }) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span>{label}</span>
        <span className={`metric-icon ${tone}`}>
          <Icon size={17} />
        </span>
      </div>
      <strong className="metric-value">{value ?? '—'}</strong>
      <div className="metric-detail">{detail}</div>
    </article>
  );
}
