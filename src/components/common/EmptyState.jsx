import { PackageOpen } from 'lucide-react';
export default function EmptyState({
  title = 'Nothing to show yet',
  description = 'Run an analysis to see your dependency health report.',
  action,
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <PackageOpen size={22} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
