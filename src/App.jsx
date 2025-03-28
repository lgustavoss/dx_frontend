import React from 'react';
import { AppProviders } from './contexts/AppProviders';
import AppRoutes from './routes';
import './App.css';

function App() {
  return (
    <AppProviders>
      <div className="App">
        <AppRoutes />
      </div>
    </AppProviders>
  );
}

export default App;