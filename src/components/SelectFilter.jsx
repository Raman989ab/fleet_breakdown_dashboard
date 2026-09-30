import { useId } from 'react';
import { ChevronIcon } from './Icons.jsx';

export default function SelectFilter({ label, allLabel, value, options, onChange }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="select-wrap">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">{allLabel}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronIcon className="select-chevron" />
      </div>
    </div>
  );
}
