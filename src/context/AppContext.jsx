import { APP_CONFIG } from '../config/app.js';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const AppContext = createContext(null);
const HISTORY_KEY = 'packagehealth.history.v1';
export function AppProvider({ children }) {
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('packagehealth.theme') || 'dark');
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, APP_CONFIG.historyLimit)));
    } catch {
      /* History remains available in memory for this session. */
    }
  }, [history]);
  useEffect(() => {
    try {
      localStorage.setItem('packagehealth.theme', theme);
    } catch {
      /* Theme still applies for this session. */
    }
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const saveReport = (next) => {
    setReport(next);
    setHistory((items) =>
      [
        {
          id: window.crypto?.randomUUID?.() || String(Date.now()),
          project: next.project.name,
          analyzedAt: next.analyzedAt,
          summary: next.summary,
        },
        ...items,
      ].slice(0, APP_CONFIG.historyLimit),
    );
  };
  const value = useMemo(
    () => ({ report, setReport, history, setHistory, saveReport, theme, setTheme }),
    [report, history, theme],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
