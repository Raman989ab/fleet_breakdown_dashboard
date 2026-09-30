import { useDashboard } from '../hooks/useDashboard.js';
import Filters from './Filters.jsx';
import MetricCards from './MetricCards.jsx';
import ComparisonChart from './ComparisonChart.jsx';
import TopIssuesChart from './TopIssuesChart.jsx';
import OutcomesChart from './OutcomesChart.jsx';
import OperatorPieChart from './OperatorPieChart.jsx';
import TrendChart from './TrendChart.jsx';

export default function Dashboard({ rows, badDates }) {
  const d = useDashboard(rows);

  return (
    <>
      <Filters
        options={d.options}
        filters={d.filters}
        onChange={d.setFilter}
        onToggleOperator={d.toggleOperator}
        onClearOperators={d.clearOperators}
        onClear={d.clearAll}
        activeCount={d.activeCount}
      />

      <MetricCards metrics={d.metrics} totalInFile={rows.length} />

      {badDates > 0 && (
        <p className="notice">{badDates} row{badDates === 1 ? '' : 's'} had an unreadable date and are left out of the trend chart only.</p>
      )}

      {/* Order required by the brief: Comparison → Top Issues → Outcomes → Pie → Timeline */}
      <main className="grid">
        {d.comparisonActive && d.comparison && <ComparisonChart data={d.comparison} filters={d.filters} />}
        <TopIssuesChart data={d.issues} />
        <OutcomesChart data={d.outcomes} />
        <OperatorPieChart slices={d.operatorSlices} />
        <TrendChart rows={d.filtered} />
      </main>
    </>
  );
}
