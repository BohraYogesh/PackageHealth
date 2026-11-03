import { BarChart3, FileSearch, Files, Settings, ShieldCheck } from 'lucide-react';
export const navigation = [
  { label: 'Overview', path: '/dashboard', icon: BarChart3 },
  { label: 'Analyzer', path: '/analyzer', icon: FileSearch },
  { label: 'Reports', path: '/reports', icon: Files },
];
export const utilityNavigation = [{ label: 'Settings', path: '/settings', icon: Settings }];
export const brand = {
  name: 'PackageHealth',
  tagline: 'Dependency intelligence',
  icon: ShieldCheck,
};
