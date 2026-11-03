import { NavLink } from 'react-router-dom';
import { Activity, Github, ShieldCheck } from 'lucide-react';
import { navigation, utilityNavigation } from '../../constants/navigation.js';
export default function Sidebar({ mobileOpen, onNavigate }) {
  return (
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand">
        <span className="brand-mark">
          <ShieldCheck size={21} />
        </span>
        <span>
          <b>PackageHealth</b>
          <small>DEPENDENCY INTELLIGENCE</small>
        </span>
      </div>
      <div className="side-label">WORKSPACE</div>
      <nav>
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onNavigate}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="side-label side-label-bottom">PREFERENCES</div>
      <nav>
        {utilityNavigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onNavigate}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="api-status">
          <span className="status-dot" />
          <span>
            <b>Data sources</b>
            <small>npm Registry · OSV</small>
          </span>
        </div>
        <a href="https://github.com" target="_blank" rel="noreferrer" className="github-link">
          <Github size={16} /> Open source project <Activity size={13} />
        </a>
        <small className="version-label">PACKAGEHEALTH V1.0.0</small>
      </div>
    </aside>
  );
}
