import { BusIcon, UploadIcon } from './Icons.jsx';

export default function Header({ fileName, rowCount, onReset }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark"><BusIcon /></span>
        <div>
          <h1 className="brand-title">Fleet Breakdown Analytics</h1>
          {fileName && (
            <p className="brand-sub">{fileName} · {rowCount.toLocaleString()} records</p>
          )}
        </div>
      </div>
      {onReset && (
        <button type="button" className="btn btn-ghost" onClick={onReset}>
          <UploadIcon width={16} height={16} /> Upload new file
        </button>
      )}
    </header>
  );
}
