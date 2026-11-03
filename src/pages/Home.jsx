import {
  ArrowRight,
  CheckCircle2,
  GitBranch,
  PackageCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <div className="home-page">
      <div className="hero-kicker">
        <span className="pulse-dot" /> OPEN SOURCE · BUILT FOR THE JS ECOSYSTEM
      </div>
      <section className="hero">
        <div className="hero-copy">
          <h1>
            Know what’s inside
            <br />
            your <span>dependencies.</span>
          </h1>
          <p>
            Get a clear picture of your npm dependency health. Find outdated packages, spot known
            vulnerabilities, and make confident maintenance decisions.
          </p>
          <div className="hero-actions">
            <Link className="button-primary large" to="/analyzer">
              Analyze a project <ArrowRight size={17} />
            </Link>
            <a
              className="button-secondary large"
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
            >
              <GitBranch size={17} /> View on GitHub
            </a>
          </div>
          <div className="hero-trust">
            <span>
              <CheckCircle2 size={14} /> No install required
            </span>
            <span>
              <CheckCircle2 size={14} /> No code execution
            </span>
            <span>
              <CheckCircle2 size={14} /> Open data sources
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-shield">
            <ShieldCheck size={76} strokeWidth={1.15} />
          </div>
          <div className="float-card float-card-top">
            <span className="float-icon green">
              <PackageCheck size={16} />
            </span>
            <span>
              <b>Dependencies checked</b>
              <small>npm Registry</small>
            </span>
            <strong>✓</strong>
          </div>
          <div className="float-card float-card-bottom">
            <span className="float-icon purple">
              <Sparkles size={16} />
            </span>
            <span>
              <b>Security insights</b>
              <small>Powered by OSV</small>
            </span>
            <span className="live-pill">LIVE</span>
          </div>
        </div>
      </section>
      <section className="home-features">
        <div>
          <span className="feature-icon">
            <PackageCheck size={19} />
          </span>
          <h3>Version intelligence</h3>
          <p>
            Compare declared ranges with the latest release and the newest version that satisfies
            your range.
          </p>
        </div>
        <div>
          <span className="feature-icon">
            <ShieldCheck size={19} />
          </span>
          <h3>Security visibility</h3>
          <p>Query OSV for known vulnerabilities. Unknown data stays clearly marked as unknown.</p>
        </div>
        <div>
          <span className="feature-icon">
            <GitBranch size={19} />
          </span>
          <h3>Actionable reports</h3>
          <p>Filter, search, export and keep a local history of your dependency analysis.</p>
        </div>
      </section>
      <div className="home-bottom">
        <span>READY WHEN YOU ARE</span>
        <h2>A healthier dependency tree starts here.</h2>
        <Link to="/analyzer" className="inline-link">
          Start your first analysis <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
