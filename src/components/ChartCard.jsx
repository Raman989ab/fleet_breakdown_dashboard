export default function ChartCard({ title, subtitle, actions, className = '', empty, children }) {
  return (
    <section className={`card glass ${className}`}>
      <header className="card-head">
        <div>
          <h2 className="card-title">{title}</h2>
          {subtitle && <p className="card-sub">{subtitle}</p>}
        </div>
        {actions}
      </header>
      {empty ? <p className="empty">No breakdowns match the current filters.</p> : children}
    </section>
  );
}
