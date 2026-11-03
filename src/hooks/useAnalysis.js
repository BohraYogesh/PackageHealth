import { useState } from 'react';
import { analyzePackageJson } from '../services/api.js';
import { useApp } from '../context/AppContext.jsx';
export function useAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { saveReport } = useApp();
  const runAnalysis = async (content) => {
    setLoading(true);
    setError('');
    try {
      const result = await analyzePackageJson(content);
      saveReport(result);
      return result;
    } catch (err) {
      setError(err.message || 'Unable to analyze this package.json.');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, runAnalysis, clearError: () => setError('') };
}
