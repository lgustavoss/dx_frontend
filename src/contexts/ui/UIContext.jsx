import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Criar o contexto
const UIContext = createContext();

// Criar o provedor
export function UIProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  // Detectar tamanho da tela para responsividade
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      
      // Fechar sidebar automaticamente em dispositivos móveis
      if (window.innerWidth < 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen]);

  // Atualizar rota ativa baseado no react-router
  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location]);

  // Alternar estado do sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Configurar rota ativa
  const setRoute = (route) => {
    setActiveRoute(route);
  };

  const value = {
    isSidebarOpen,
    toggleSidebar,
    activeRoute,
    setRoute,
    isMobile
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

// Hook para usar o contexto
export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI deve ser usado dentro de um UIProvider');
  }
  return context;
}