import * as XLSX from 'xlsx';

export const REQUIRED_COLUMNS = ['sno', 'date', 'service id', 'operator', 'route', 'issue', 'type', 'result'];
import { UNKNOWN } from './constants.js';
export { UNKNOWN };

const clean = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();
const normHeader = (h) => clean(h).toLowerCase().replace(/_/g, ' ');
const pad = (n) => String(n).padStart(2, '0');
const withDefault = (v) => clean(v) || UNKNOWN;

// Converts whatever the file gives us (Date, Excel serial number, text) to "YYYY-MM-DD".
function toISODate(v) {
  if (v instanceof Date && !isNaN(v)) {
    // +12h keeps us on the right calendar day whatever the timezone quirk of the parser
    const d = new Date(v.getTime() + 12 * 3600 * 1000);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }
  if (typeof v === 'number') {
    const p = XLSX.SSF.parse_date_code(v);
    return p ? `${p.y}-${pad(p.m)}-${pad(p.d)}` : null;
  }
  const s = clean(v);
  if (!s) return null;
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/); // DD/MM/YYYY (Indian format)
  if (m) return `${m[3]}-${pad(m[2])}-${pad(m[1])}`;
  const d = new Date(s);
  return isNaN(d) ? null : toISODate(d);
}

// "Radiator issue." and "radiator issue" should count as the same issue
const issueKeyOf = (s) => s.toLowerCase().replace(/[\s.,;:!]+$/g, '');

export async function parseTrackerFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error('This file has no sheets.');

  const raw = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: true });
  if (!raw.length) throw new Error('The first sheet is empty.');

  const present = new Set(Object.keys(raw[0]).map(normHeader));
  const missing = REQUIRED_COLUMNS.filter((c) => !present.has(c));
  if (missing.length) {
    throw new Error(`Missing required column(s): ${missing.join(', ')}.`);
  }

  let badDates = 0;
  const rows = raw.map((original, i) => {
    const r = {};
    for (const [k, v] of Object.entries(original)) r[normHeader(k)] = v;
    const date = toISODate(r['date']);
    if (!date) badDates += 1;
    const issue = withDefault(r['issue']);
    return {
      id: i,
      sno: r['sno'],
      date,
      serviceId: clean(r['service id']),
      operator: withDefault(r['operator']),
      route: withDefault(r['route']),
      issue,
      issueKey: issueKeyOf(issue),
      type: withDefault(r['type']),
      result: withDefault(r['result']),
    };
  });

  return { rows, fileName: file.name, badDates };
}
