import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from './ChartCard.jsx';
import { PALETTE, truncate } from '../utils/format.js';

// Tooltip lists the breakdown TYPES behind the hovered bar (e.g. AC: 2, Engine: 1)
function ComparisonTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="tip">
      <p className="tip-title">{d.operator}</p>
      <p className="tip-total">{d.total} breakdown{d.total === 1 ? '' : 's'}</p>
      {d.typeList.length > 0 ? (
        <ul className="tip-list">
          {d.typeList.map(([type, count]) => (
            <li key={type}><span>{type}</span><b>{count}</b></li>
          ))}
        </ul>
      ) : (
        <p className="tip-note">No breakdowns with the current filters</p>
      )}
    </div>
  );
}

export default function ComparisonChart({ data, filters }) {
  const bits = [];
  if (filters.route) bits.push(`Route: ${filters.route}`);
  if (filters.operators.length > 1) bits.push(`${filters.operators.length} operators selected`);
  const subtitle = `${bits.join(' · ')} — hover a bar to see the issue types`;
  const tilt = data.length > 5;

  return (
    <ChartCard title="Operator comparison" subtitle={subtitle} className="span-12 card-accent">
      <div className="chart-box" style={{ height: 340 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 22, right: 12, left: -8, bottom: tilt ? 34 : 6 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(22,35,59,.10)" />
            <XAxis
              dataKey="operator"
              interval={0}
              tickLine={false}
              axisLine={false}
              angle={tilt ? -30 : 0}
              textAnchor={tilt ? 'end' : 'middle'}
              tickFormatter={(v) => truncate(v, 16)}
              tick={{ fontSize: 12, fill: '#3b4a63' }}
            />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7a90' }} />
            <Tooltip content={<ComparisonTooltip />} cursor={{ fill: 'rgba(22,35,59,.05)' }} />
            <Bar dataKey="total" radius={[8, 8, 0, 0]} maxBarSize={72}>
              {data.map((d, i) => <Cell key={d.operator} fill={PALETTE[i % PALETTE.length]} />)}
              <LabelList dataKey="total" position="top" style={{ fontSize: 12, fontWeight: 600, fill: '#16233b' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
