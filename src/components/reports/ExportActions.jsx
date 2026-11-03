import { useState } from 'react';
import { Clipboard, Download, FileJson } from 'lucide-react';
import { downloadFile, toCsv } from '../../utils/report.js';
export default function ExportActions({ report }) {
  const [copied, setCopied] = useState(false);
  const exportJson = () =>
    downloadFile('packagehealth-report.json', JSON.stringify(report, null, 2), 'application/json');
  const exportCsv = () =>
    downloadFile('packagehealth-dependencies.csv', toCsv(report), 'text/csv;charset=utf-8');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="export-actions">
      <button className="button-secondary" onClick={copy}>
        <Clipboard size={15} /> {copied ? 'Copied' : 'Copy JSON'}
      </button>
      <button className="button-secondary" onClick={exportCsv}>
        <Download size={15} /> Export CSV
      </button>
      <button className="button-primary" onClick={exportJson}>
        <FileJson size={15} /> Export JSON
      </button>
    </div>
  );
}
