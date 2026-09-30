import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronIcon, SearchIcon } from './Icons.jsx';

export default function OperatorMultiSelect({ options, selected, onToggle, onClear }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  const summary =
    selected.length === 0 ? 'All Operators' : selected.length === 1 ? selected[0] : `${selected.length} operators selected`;

  return (
    <div className="field" ref={rootRef}>
      <span className="field-label" id="operator-label">Operator</span>
      <div className="select-wrap">
        <button
          type="button"
          className={`select-btn${open ? ' is-open' : ''}`}
          aria-haspopup="true"
          aria-expanded={open}
          aria-labelledby="operator-label"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="select-btn-text">{summary}</span>
          <ChevronIcon className="select-chevron" />
        </button>

        {open && (
          <div className="popover glass" role="group" aria-label="Choose operators">
            <div className="popover-search">
              <SearchIcon />
              <input
                type="search"
                placeholder="Search operators"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="popover-list">
              <label className="check check-all">
                <input type="checkbox" checked={selected.length === 0} onChange={onClear} />
                <span className="box" />
                <span>All Operators</span>
              </label>
              {visible.map((o) => (
                <label className="check" key={o.value}>
                  <input type="checkbox" checked={selected.includes(o.value)} onChange={() => onToggle(o.value)} />
                  <span className="box" />
                  <span>{o.label}</span>
                </label>
              ))}
              {visible.length === 0 && <p className="popover-empty">No operator matches “{query}”.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
