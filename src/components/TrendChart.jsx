import { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from './ChartCard.jsx';
import Segmented from './Segmented.jsx';
import { trendSeries } from '../utils/analytics.js';

const GRANULARITY = [
  { label: 'Daily', value: 'day' },
  { label: 'Weekly', value: 'week' },
  { label: 'Monthly', value: 'month' },
];

function TrendTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="tip">
      <p className="tip-title">{d.label}</p>
      <p className="tip-total">{d.value} breakdown{d.value === 1 ? '' : 's'}</p>
    </div>
  );
}

export default function TrendChart({ rows }) {
  const [gran, setGran] = useState('day');
  const data = useMemo(() => trendSeries(rows, gran), [rows, gran]);

  return (
    <ChartCard
      title="Breakdown trend"
      subtitle="Volume over time, oldest to newest (periods with no breakdowns are not shown)"
      className="span-7"
      empty={data.length === 0}
      actions={<Segmented label="Group by" options={GRANULARITY} value={gran} onChange={setGran} />}
    >
      <div className="chart-box" style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 12, right: 16, left: -12, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(22,35,59,.10)" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={36} tick={{ fontSize: 11, fill: '#6b7a90' }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7a90' }} />
            <Tooltip content={<TrendTooltip />} />
            <Line type="monotone" dataKey="value" stroke="#1f8a8a" strokeWidth={2.4} dot={{ r: 2.5, fill: '#1f8a8a' }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
