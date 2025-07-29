import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { ArtworkDataTable } from './components/ArtworkDataTable';

// Import PrimeReact CSS
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
  return (
    <PrimeReactProvider>
      <div className="App">
        <ArtworkDataTable />
      </div>
    </PrimeReactProvider>
  );
}

export default App;