import { Moon, Sun, Trash2, ShieldCheck, Database } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
export default function Settings() {
  const { theme, setTheme, setHistory, history } = useApp();
  return (
    <div className="page-stack">
      <div className="page-intro">
        <div>
          <span className="eyebrow">PREFERENCES</span>
          <h1>Settings</h1>
          <p>Manage your local PackageHealth experience.</p>
        </div>
      </div>
      <section className="panel settings-panel">
        <div className="setting-row">
          <span className="setting-icon">
            <Sun size={18} />
          </span>
          <div>
            <b>Appearance</b>
            <p>Choose the interface theme.</p>
          </div>
          <div className="theme-toggle">
            <button className={theme === 'dark' ? 'selected' : ''} onClick={() => setTheme('dark')}>
              <Moon size={14} /> Dark
            </button>
            <button
              className={theme === 'light' ? 'selected' : ''}
              onClick={() => setTheme('light')}
            >
              <Sun size={14} /> Light
            </button>
          </div>
        </div>
        <div className="setting-row">
          <span className="setting-icon">
            <Database size={18} />
          </span>
          <div>
            <b>Analysis history</b>
            <p>{history.length} reports saved in this browser’s local storage.</p>
          </div>
          <button
            className="button-secondary"
            onClick={() => {
              if (window.confirm('Delete all local analysis history?')) setHistory([]);
            }}
            disabled={!history.length}
          >
            <Trash2 size={14} /> Clear history
          </button>
        </div>
        <div className="setting-row">
          <span className="setting-icon">
            <ShieldCheck size={18} />
          </span>
          <div>
            <b>Data & privacy</b>
            <p>
              Manifest content is sent to this app’s backend for registry and OSV lookups. Reports
              stay in your browser and are not uploaded to an account.
            </p>
          </div>
          <span className="privacy-pill">NO ACCOUNT</span>
        </div>
      </section>
      <div className="settings-footnote">
        PackageHealth does not install dependencies or execute scripts from uploaded files. External
        services receive package names and exact versions when eligible for a vulnerability query.
      </div>
    </div>
  );
}
