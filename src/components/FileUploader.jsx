import { useRef, useState } from 'react';
import { REQUIRED_COLUMNS, parseTrackerFile } from '../utils/parseFile.js';
import { UploadIcon } from './Icons.jsx';

const ACCEPT = '.xlsx,.xls,.csv';

export default function FileUploader({ onLoaded }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      setError('Please choose an Excel file (.xlsx). CSV also works.');
      return;
    }
    setBusy(true);
    try {
      onLoaded(await parseTrackerFile(file));
    } catch (e) {
      setError(e.message || 'Could not read this file.');
    } finally {
      setBusy(false);
    }
  };

  const loadSample = async () => {
    setError('');
    setBusy(true);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}sample-data/Anonymized_Breakdown_Tracker.csv`);
      const blob = await res.blob();
      onLoaded(await parseTrackerFile(new File([blob], 'Anonymized_Breakdown_Tracker.csv')));
    } catch (e) {
      setError('Could not load the sample file.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="landing">
      <div className="landing-copy">
        <h2>Upload your Breakdown Tracker</h2>
        <p>Drop the Excel file here and every chart, filter and comparison is built in your browser. Nothing is sent to a server.</p>
      </div>

      <div
        className={`dropzone glass${dragging ? ' is-dragging' : ''}${busy ? ' is-busy' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Upload breakdown tracker file"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), inputRef.current?.click())}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
      >
        <span className="dropzone-icon"><UploadIcon width={30} height={30} /></span>
        <strong>{busy ? 'Reading your file…' : 'Drag & drop your Excel file here'}</strong>
        <span className="dropzone-hint">or click to browse · .xlsx, .xls, .csv</span>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          hidden
          onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }}
        />
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      <div className="landing-foot">
        <p className="cols-label">Required columns</p>
        <ul className="chips">
          {REQUIRED_COLUMNS.map((c) => <li key={c}>{c}</li>)}
        </ul>
        <button type="button" className="btn btn-link" onClick={loadSample} disabled={busy}>
          No file handy? Try the sample data
        </button>
      </div>
    </section>
  );
}
