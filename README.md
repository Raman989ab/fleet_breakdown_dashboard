# Fleet Breakdown Analytics Dashboard

Single-page app: upload the Breakdown Tracker (.xlsx / .csv) and explore it with filters and charts.
Built with React + Vite + Recharts + SheetJS (xlsx). Everything runs in the browser.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```

## Static build
```bash
npm run build      # output in /dist (upload this folder to Netlify / any static host)
npm run preview    # test the production build locally
```

## Structure
```
src/
  App.jsx                  upload screen <-> dashboard
  hooks/useDashboard.js    filter state + all derived data
  utils/parseFile.js       reads xlsx/csv, validates columns, cleans rows
  utils/analytics.js       pure functions: options, filters, metrics, chart data
  components/              Filters, OperatorMultiSelect, MetricCards, and one file per chart
  styles/index.css         design tokens, glass surfaces, CSS Grid layout
public/sample-data/        the sample tracker (used by "Try the sample data")
```
