const styles = {
  current: 'badge-green',
  scanned: 'badge-green',
  clear: 'badge-green',
  outdated: 'badge-amber',
  vulnerable: 'badge-red',
  deprecated: 'badge-red',
  unknown: 'badge-muted',
  unavailable: 'badge-muted',
  ahead: 'badge-blue',
};
export default function StatusBadge({ status, children }) {
  return <span className={`badge ${styles[status] || 'badge-muted'}`}>{children || status}</span>;
}
