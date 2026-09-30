import { useCallback, useMemo, useState } from 'react';
import {
  EMPTY_FILTERS,
  applyFilters,
  buildOptions,
  comparisonData,
  computeMetrics,
  isComparisonActive,
  issueFrequency,
  operatorShare,
  outcomeDistribution,
} from '../utils/analytics.js';

// One hook owns the filter state and every number the dashboard shows.
export function useDashboard(rows) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const options = useMemo(() => buildOptions(rows), [rows]);
  const filtered = useMemo(() => applyFilters(rows, filters), [rows, filters]);

  const issues = useMemo(() => issueFrequency(filtered), [filtered]);
  const metrics = useMemo(() => computeMetrics(filtered, issues), [filtered, issues]);
  const outcomes = useMemo(() => outcomeDistribution(filtered), [filtered]);
  const operatorSlices = useMemo(() => operatorShare(filtered), [filtered]);
  const comparison = useMemo(() => comparisonData(filtered, filters), [filtered, filters]);

  const setFilter = useCallback((key, value) => setFilters((f) => ({ ...f, [key]: value })), []);
  const toggleOperator = useCallback(
    (op) =>
      setFilters((f) => ({
        ...f,
        operators: f.operators.includes(op) ? f.operators.filter((o) => o !== op) : [...f.operators, op],
      })),
    []
  );
  const clearOperators = useCallback(() => setFilters((f) => ({ ...f, operators: [] })), []);
  const clearAll = useCallback(() => setFilters(EMPTY_FILTERS), []);

  const activeCount =
    (filters.operators.length ? 1 : 0) + (filters.route ? 1 : 0) + (filters.type ? 1 : 0) + (filters.result ? 1 : 0);

  return {
    filters, options, filtered, issues, metrics, outcomes, operatorSlices, comparison,
    comparisonActive: isComparisonActive(filters),
    activeCount, setFilter, toggleOperator, clearOperators, clearAll,
  };
}
