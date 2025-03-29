import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const UIContext = createContext();

export function useUI() {
  return useContext(UIContext);
}

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

  // Função específica para fechar o sidebar
  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  // Configurar rota ativa
  const setRoute = (route) => {
    setActiveRoute(route);
  };

  const value = {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar, // Nova função adicionada
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