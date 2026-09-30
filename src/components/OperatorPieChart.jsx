import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import ChartCard from './ChartCard.jsx';
import { MUTED_SLICE, PALETTE } from '../utils/format.js';

const TOP_SLICES = 7;

function SliceTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="tip">
      <p className="tip-title">{d.name}</p>
      <p className="tip-total">{d.value} breakdowns · {d.pct.toFixed(1)}%</p>
    </div>
  );
}

export default function OperatorPieChart({ slices }) {
  // 100+ operators would be unreadable as slices: show the biggest ones and group the rest.
  const { pieData, colorOf } = useMemo(() => {
    const top = slices.slice(0, TOP_SLICES);
    const rest = slices.slice(TOP_SLICES);
    const data = [...top];
    if (rest.length) {
      data.push({
        name: `Others (${rest.length} operators)`,
        value: rest.reduce((s, x) => s + x.value, 0),
        pct: rest.reduce((s, x) => s + x.pct, 0),
      });
    }
    const colors = new Map(top.map((x, i) => [x.name, PALETTE[i % PALETTE.length]]));
    return { pieData: data, colorOf: (name) => colors.get(name) || MUTED_SLICE };
  }, [slices]);

  return (
    <ChartCard
      title="Operator distribution"
      subtitle={`Share of breakdowns across ${slices.length} operator${slices.length === 1 ? '' : 's'}`}
      className="span-5"
      empty={slices.length === 0}
    >
      <div className="pie-layout">
        <div className="chart-box" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius="92%" stroke="#fff" strokeWidth={2} paddingAngle={1}>
                {pieData.map((d, i) => (
                  <Cell key={d.name} fill={i < TOP_SLICES ? colorOf(d.name) : MUTED_SLICE} />
                ))}
              </Pie>
              <Tooltip content={<SliceTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="legend-list" aria-label="All operators">
          {slices.map((s) => (
            <li key={s.name}>
              <i style={{ background: colorOf(s.name) }} />
              <span className="legend-name">{s.name}</span>
              <b>{s.value}</b>
              <em>{s.pct.toFixed(1)}%</em>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}
