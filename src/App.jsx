import { useState } from 'react';
import Header from './components/Header.jsx';
import FileUploader from './components/FileUploader.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const [dataset, setDataset] = useState(null); // { rows, fileName, badDates }

  return (
    <div className="shell">
      <Header
        fileName={dataset?.fileName}
        rowCount={dataset?.rows.length ?? 0}
        onReset={dataset ? () => setDataset(null) : undefined}
      />
      {dataset ? (
        // key => a fresh file always starts with clean filters
        <Dashboard key={dataset.fileName + dataset.rows.length} rows={dataset.rows} badDates={dataset.badDates} />
      ) : (
        <FileUploader onLoaded={setDataset} />
      )}
    </div>
  );
}
