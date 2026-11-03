import { Menu, Moon, Sun } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
const titles = {
  '/': 'Welcome',
  '/dashboard': 'Overview',
  '/analyzer': 'Dependency analyzer',
  '/reports': 'Analysis reports',
  '/settings': 'Settings',
};
export default function Topbar({ onMenu }) {
  const location = useLocation();
  const { theme, setTheme } = useApp();
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open navigation">
        <Menu size={19} />
      </button>
      <div>
        <div className="breadcrumb">
          WORKSPACE <span>/</span> <b>{titles[location.pathname] || 'Page'}</b>
        </div>
      </div>
      <div className="topbar-actions">
        <span className="live-indicator">
          <i /> LIVE DATA
        </span>
        <button
          className="icon-button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <div className="avatar">PH</div>
      </div>
    </header>
  );
}
