export const truncate = (s, n = 28) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
export const pct = (part, total) => (total ? ((part / total) * 100).toFixed(1) : '0.0');

// Curated palette used across charts
export const PALETTE = ['#e9a23b', '#1f8a8a', '#4d6fa5', '#c8553d', '#7b5ea7', '#7fa37a', '#d1a15f', '#3e5c76'];
export const MUTED_SLICE = '#b7c2d3';

export const RESULT_COLORS = {
  Delay: '#e9a23b',
  Cancelled: '#c8553d',
  'Partially Cancelled': '#d1a15f',
  Inconvenience: '#4d6fa5',
  Alternate: '#7fa37a',
  Unknown: '#b7c2d3',
};
