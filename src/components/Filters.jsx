import OperatorMultiSelect from './OperatorMultiSelect.jsx';
import SelectFilter from './SelectFilter.jsx';

export default function Filters({ options, filters, onChange, onToggleOperator, onClearOperators, onClear, activeCount }) {
  return (
    <section className="filters glass" aria-label="Filters">
      <OperatorMultiSelect
        options={options.operators}
        selected={filters.operators}
        onToggle={onToggleOperator}
        onClear={onClearOperators}
      />
      <SelectFilter label="Route" allLabel="All Routes" value={filters.route} options={options.routes} onChange={(v) => onChange('route', v)} />
      <SelectFilter label="Breakdown Type" allLabel="All Types" value={filters.type} options={options.types} onChange={(v) => onChange('type', v)} />
      <SelectFilter label="Result" allLabel="All Results" value={filters.result} options={options.results} onChange={(v) => onChange('result', v)} />
      <button type="button" className="btn btn-soft" onClick={onClear} disabled={activeCount === 0}>
        Clear filters{activeCount ? ` (${activeCount})` : ''}
      </button>
    </section>
  );
}
