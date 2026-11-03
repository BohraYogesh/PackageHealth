import { useState } from 'react';
import { AlertTriangle, ArrowRight, Clock3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnalyzerForm from '../components/analyzer/AnalyzerForm.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import { useAnalysis } from '../hooks/useAnalysis.js';
import { useApp } from '../context/AppContext.jsx';
export default function Analyzer() {
  const { loading, error, runAnalysis } = useAnalysis();
  const { report, history } = useApp();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState('');
  const handleAnalyze = async (content) => {
    setLocalError('');
    try {
      await runAnalysis(content);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.message);
    }
  };
  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <span className="eyebrow">DEPENDENCY INTELLIGENCE</span>
          <h1>Analyze a project</h1>
          <p>Inspect package metadata and known security advisories from trusted public sources.</p>
        </div>
        <div className="privacy-note">
          <span className="privacy-dot" /> PRIVATE BY DESIGN
        </div>
      </div>
      <div className="analyzer-layout">
        <div>
          <AnalyzerForm onAnalyze={handleAnalyze} loading={loading} error={localError || error} />
          {loading && <LoadingState />}
        </div>
        <aside className="analyzer-aside">
          <div className="aside-card">
            <span className="aside-icon">
              <AlertTriangle size={18} />
            </span>
            <h3>Important about versions</h3>
            <p>
              A package.json contains version ranges, not necessarily the exact versions installed
              on disk. PackageHealth only performs OSV vulnerability lookups for exact semantic
              versions.
            </p>
            <p className="aside-muted">
              For accurate resolved-version security checks, use your lockfile in a future
              lockfile-enabled workflow.
            </p>
          </div>
          <div className="aside-card source-card">
            <span className="eyebrow">DATA SOURCES</span>
            <div className="source-row">
              <b>npm Registry</b>
              <span>Package versions & metadata</span>
            </div>
            <div className="source-row">
              <b>OSV</b>
              <span>Known vulnerability records</span>
            </div>
          </div>
          {history.length > 0 && (
            <button className="recent-link" onClick={() => navigate('/reports')}>
              <Clock3 size={15} /> View {history.length} recent{' '}
              {history.length === 1 ? 'analysis' : 'analyses'} <ArrowRight size={14} />
            </button>
          )}
          {report && <p className="last-report">Last analyzed: {report.project.name}</p>}
        </aside>
      </div>
    </div>
  );
}
