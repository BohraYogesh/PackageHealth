import { LoaderCircle } from 'lucide-react';
export default function LoadingState() {
  return (
    <div className="loading-state">
      <LoaderCircle className="spin" size={24} />
      <strong>Checking your dependencies</strong>
      <span>Querying npm Registry and OSV vulnerability data. This can take a moment.</span>
    </div>
  );
}
