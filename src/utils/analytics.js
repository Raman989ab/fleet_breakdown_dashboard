import { UNKNOWN } from './constants.js';

const cmp = (a, b) => a.localeCompare(b);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const EMPTY_FILTERS = { operators: [], route: '', type: '', result: '' };

/* ---------- dropdown options (dynamic + alphabetical) ---------- */
export function buildOptions(rows) {
  const operatorRoutes = new Map();
  const routes = new Set();
  const types = new Set();
  const results = new Set();

  for (const r of rows) {
    if (!operatorRoutes.has(r.operator)) operatorRoutes.set(r.operator, new Set());
    if (r.route !== UNKNOWN) operatorRoutes.get(r.operator).add(r.route);
    routes.add(r.route);
    types.add(r.type);
    results.add(r.result);
  }

  const operators = [...operatorRoutes.keys()].sort(cmp).map((name) => {
    const n = operatorRoutes.get(name).size;
    return { value: name, label: n > 1 ? `${name} (${n} routes)` : name };
  });

  return {
    operators,
    routes: [...routes].sort(cmp),
    types: [...types].sort(cmp),
    results: [...results].sort(cmp),
  };
}

export function applyFilters(rows, f) {
  const ops = f.operators.length ? new Set(f.operators) : null;
  return rows.filter(
    (r) =>
      (!ops || ops.has(r.operator)) &&
      (!f.route || r.route === f.route) &&
      (!f.type || r.type === f.type) &&
      (!f.result || r.result === f.result)
  );
}

/* ---------- small helpers ---------- */
const tally = (rows, keyFn) => {
  const m = new Map();
  for (const r of rows) {
    const k = keyFn(r);
    m.set(k, (m.get(k) || 0) + 1);
  }
  return m;
};
const toSorted = (m) =>
  [...m.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value || cmp(a.name, b.name));

/* ---------- metrics ---------- */
export function issueFrequency(rows) {
  const groups = new Map();
  for (const r of rows) {
    let g = groups.get(r.issueKey);
    if (!g) {
      g = { count: 0, labels: new Map() };
      groups.set(r.issueKey, g);
    }
    g.count += 1;
    g.labels.set(r.issue, (g.labels.get(r.issue) || 0) + 1);
  }
  return [...groups.values()]
    .map((g) => {
      const label = [...g.labels.entries()].sort((a, b) => b[1] - a[1] || cmp(a[0], b[0]))[0][0];
      return { name: label, value: g.count };
    })
    .sort((a, b) => b.value - a.value || cmp(a.name, b.name));
}

export function computeMetrics(rows, issues) {
  const routes = toSorted(tally(rows, (r) => r.route)).filter((x) => x.name !== UNKNOWN);
  return {
    total: rows.length,
    topIssue: issues.find((x) => x.name !== UNKNOWN) || null,
    worstRoute: routes[0] || null,
  };
}

/* ---------- charts ---------- */
export const outcomeDistribution = (rows) => toSorted(tally(rows, (r) => r.result));

export function operatorShare(rows) {
  const list = toSorted(tally(rows, (r) => r.operator));
  const total = rows.length || 1;
  return list.map((x) => ({ ...x, pct: (x.value / total) * 100 }));
}

function weekStart(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - ((dt.getUTCDay() + 6) % 7)); // Monday
  return dt.toISOString().slice(0, 10);
}

function bucketKey(iso, gran) {
  if (gran === 'month') return iso.slice(0, 7);
  if (gran === 'week') return weekStart(iso);
  return iso;
}

function bucketLabel(key, gran) {
  if (gran === 'month') {
    const [y, m] = key.split('-');
    return `${MONTHS[Number(m) - 1]} ${y}`;
  }
  const [y, m, d] = key.split('-');
  const base = `${Number(d)} ${MONTHS[Number(m) - 1]} ${y.slice(2)}`;
  return gran === 'week' ? `Week of ${base}` : base;
}

// Always sorted chronologically, no matter how messy the file order is.
export function trendSeries(rows, gran = 'day') {
  const m = new Map();
  for (const r of rows) {
    if (!r.date) continue;
    const k = bucketKey(r.date, gran);
    m.set(k, (m.get(k) || 0) + 1);
  }
  return [...m.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([key, value]) => ({ key, label: bucketLabel(key, gran), value }));
}

/* ---------- comparison chart ---------- */
export const isComparisonActive = (f) => Boolean(f.route) || f.operators.length > 1;

export function comparisonData(rows, f) {
  if (!isComparisonActive(f)) return null;
  const map = new Map();
  // explicitly ticked operators always get a bar, even if they have 0 matches
  f.operators.forEach((o) => map.set(o, { operator: o, total: 0, types: new Map() }));
  for (const r of rows) {
    if (!map.has(r.operator)) map.set(r.operator, { operator: r.operator, total: 0, types: new Map() });
    const e = map.get(r.operator);
    e.total += 1;
    e.types.set(r.type, (e.types.get(r.type) || 0) + 1);
  }
  return [...map.values()]
    .map((e) => ({
      operator: e.operator,
      total: e.total,
      typeList: [...e.types.entries()].sort((a, b) => b[1] - a[1] || cmp(a[0], b[0])),
    }))
    .sort((a, b) => b.total - a.total || cmp(a.operator, b.operator));
}
