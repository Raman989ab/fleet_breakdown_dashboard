import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartCard from './ChartCard.jsx';
import { PALETTE, RESULT_COLORS } from '../utils/format.js';

export default function OutcomesChart({ data }) {
  return (
    <ChartCard title="Outcomes" subtitle="What each breakdown led to" className="span-5" empty={data.length === 0}>
      <div className="chart-box" style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 22, right: 8, left: -12, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(22,35,59,.10)" />
            <XAxis dataKey="name" interval={0} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#3b4a63' }} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7a90' }} />
            <Tooltip cursor={{ fill: 'rgba(22,35,59,.05)' }} formatter={(v) => [v, 'Breakdowns']} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
              {data.map((d, i) => <Cell key={d.name} fill={RESULT_COLORS[d.name] || PALETTE[i % PALETTE.length]} />)}
              <LabelList dataKey="value" position="top" style={{ fontSize: 12, fontWeight: 600, fill: '#16233b' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
