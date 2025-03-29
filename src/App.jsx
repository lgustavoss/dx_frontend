import React from 'react';
import { AppProviders } from './contexts/AppProviders';
import { useUI } from './contexts/ui/UIContext';
import Navbar from './Components/ui/Navigation/Navbar/Navbar';
import Sidebar from './Components/ui/Navigation/Sidebar/Sidebar';
import './App.css';
import { Routes } from 'react-router-dom';
import authRoutes from './routes/modules/authRoutes';
import clienteRoutes from './routes/modules/clienteRoutes';
import usuarioRoutes from './routes/modules/usuarioRoutes';
import perfilRoutes from './routes/modules/perfilRoutes';
import { Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

// Componente interno que usa os contextos
function AppContent() {
  const { isSidebarOpen, closeSidebar } = useUI();
  
  const handleContentClick = (e) => {
    if (isSidebarOpen) {
      if (!e.target.closest('.sidebar')) {
        closeSidebar();
      }
    }
  };

  return (
    <div className="App">
      <Navbar />
      <Sidebar />
      <div 
        className={`content ${isSidebarOpen ? 'sidebar-open' : ''}`}
        onClick={handleContentClick}
      >
        <Routes>
          {/* Importar diretamente as rotas em vez de usar <AppRoutes /> */}
          {authRoutes}
          {usuarioRoutes}
          {clienteRoutes}
          {perfilRoutes}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;