import { APP_CONFIG } from '../../config/app.js';
import { useRef, useState } from 'react';
import { FileJson, FileUp, Play, RotateCcw } from 'lucide-react';
const starter =
  '{\n  "name": "my-app",\n  "dependencies": {\n    "react": "^18.3.1",\n    "express": "^4.21.2"\n  },\n  "devDependencies": {\n    "vite": "^5.4.11"\n  }\n}';
export default function AnalyzerForm({ onAnalyze, loading, error }) {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [validation, setValidation] = useState('');
  const fileRef = useRef(null);
  const validate = () => {
    try {
      const data = JSON.parse(content);
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error();
      setValidation('');
      return true;
    } catch {
      setValidation('Please enter valid package.json JSON.');
      return false;
    }
  };
  const submit = (event) => {
    event.preventDefault();
    if (validate()) onAnalyze(content);
  };
  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > APP_CONFIG.maxManifestBytes) {
      setValidation('File is larger than 256 KB.');
      return;
    }
    if (file.name !== 'package.json' && !file.name.endsWith('.json')) {
      setValidation('Choose a package.json or JSON file.');
      return;
    }
    setContent(await file.text());
    setFileName(file.name);
    setValidation('');
  };
  return (
    <form className="analyzer-form panel" onSubmit={submit}>
      <div className="panel-heading">
        <div>
          <span className="eyebrow">INPUT SOURCE</span>
          <h2>Project manifest</h2>
          <p>Paste your package.json or upload the file. No code is executed.</p>
        </div>
        <button
          type="button"
          className="text-button"
          onClick={() => {
            setContent('');
            setFileName('');
            setValidation('');
          }}
        >
          <RotateCcw size={14} /> Clear
        </button>
      </div>
      <div className="editor-toolbar">
        <span>
          <FileJson size={15} /> package.json
        </span>
        <span>{fileName || 'JSON · UTF-8'}</span>
      </div>
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setValidation('');
        }}
        spellCheck="false"
        placeholder={starter}
        aria-label="package.json content"
      />
      {(validation || error) && <p className="form-error">{validation || error}</p>}
      <div className="form-footer">
        <button type="button" className="button-secondary" onClick={() => fileRef.current?.click()}>
          <FileUp size={16} /> Upload file
        </button>
        <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={upload} />
        <button className="button-primary" type="submit" disabled={loading || !content.trim()}>
          {loading ? 'Analyzing…' : 'Analyze dependencies'} <Play size={15} fill="currentColor" />
        </button>
      </div>
    </form>
  );
}
