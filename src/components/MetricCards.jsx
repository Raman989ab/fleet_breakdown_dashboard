import { RouteIcon, WrenchIcon, BusIcon } from './Icons.jsx';

export default function MetricCards({ metrics, totalInFile }) {
  const { total, topIssue, worstRoute } = metrics;
  return (
    <section className="metrics glass" aria-label="Summary">
      <article className="metric">
        <span className="metric-icon tone-amber"><BusIcon /></span>
        <div>
          <p className="metric-label">Total breakdowns</p>
          <p className="metric-value metric-number">{total.toLocaleString()}</p>
          <p className="metric-note">{total === totalInFile ? 'All records in the file' : `of ${totalInFile.toLocaleString()} in the file`}</p>
        </div>
      </article>
      <article className="metric">
        <span className="metric-icon tone-brick"><WrenchIcon /></span>
        <div>
          <p className="metric-label">Most frequent issue</p>
          <p className="metric-value" title={topIssue?.name}>{topIssue ? topIssue.name : '—'}</p>
          <p className="metric-note">{topIssue ? `${topIssue.value} times` : 'No data for these filters'}</p>
        </div>
      </article>
      <article className="metric">
        <span className="metric-icon tone-teal"><RouteIcon /></span>
        <div>
          <p className="metric-label">Highest breakdown route</p>
          <p className="metric-value" title={worstRoute?.name}>{worstRoute ? worstRoute.name : '—'}</p>
          <p className="metric-note">{worstRoute ? `${worstRoute.value} breakdowns` : 'No data for these filters'}</p>
        </div>
      </article>
    </section>
  );
}
