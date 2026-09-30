import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from './ChartCard.jsx';
import Segmented from './Segmented.jsx';
import { truncate } from '../utils/format.js';

const LIMITS = [
  { label: 'Top 10', value: 10 },
  { label: 'Top 20', value: 20 },
  { label: 'All', value: Infinity },
];

function IssueTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="tip">
      <p className="tip-title">{d.name}</p>
      <p className="tip-total">{d.value} breakdown{d.value === 1 ? '' : 's'}</p>
    </div>
  );
}

export default function TopIssuesChart({ data }) {
  const [limit, setLimit] = useState(10);
  const shown = data.slice(0, limit);
  const height = Math.max(300, shown.length * 30 + 40);

  return (
    <ChartCard
      title="Top issues"
      subtitle={`${data.length.toLocaleString()} unique issues, most frequent first`}
      className="span-7"
      empty={data.length === 0}
      actions={<Segmented label="How many issues to show" options={LIMITS} value={limit} onChange={setLimit} />}
    >
      <div className="chart-scroll">
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={shown} layout="vertical" margin={{ top: 4, right: 36, left: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(22,35,59,.10)" />
              <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7a90' }} />
              <YAxis
                type="category"
                dataKey="name"
                width={190}
                interval={0}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => truncate(v, 30)}
                tick={{ fontSize: 12, fill: '#3b4a63' }}
              />
              <Tooltip content={<IssueTooltip />} cursor={{ fill: 'rgba(22,35,59,.05)' }} />
              <Bar dataKey="value" fill="#e9a23b" radius={[0, 6, 6, 0]} barSize={16}>
                <LabelList dataKey="value" position="right" style={{ fontSize: 12, fontWeight: 600, fill: '#16233b' }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartCard>
  );
}
