import './App.css'
import Login from './Components/Login/Login'
import ListarUsuario from './Components/Usuario/ListarUsuario/ListarUsuario'
import Perfil from './Components/Perfil/Perfil'
import CadastroUsuario from './Components/Usuario/CadastroUsuario/CadastroUsuario'
import Navbar from './Components/Navbar/Navbar'
import Sidebar from './Components/Sidebar/Sidebar'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useRef, useContext } from 'react';
import { SidebarProvider, SidebarContext } from './Components/Sidebar/SidebarContext';

function App() {
  const sidebarRef = useRef(null);
  const { isSidebarOpen, toggleSidebar } = useContext(SidebarContext);

  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, toggleSidebar]);

  return (
    <div className={`App ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {!isLoginPage && <Navbar toggleSidebar={toggleSidebar} />}
      {!isLoginPage && <div ref={sidebarRef}><Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /></div>}
      <div className={`content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/usuarios" element={<ListarUsuario />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/cadastro" element={<CadastroUsuario />} />
        </Routes>
      </div>
    </div>
  )
}

export default function AppWrapper() {
  return (
    <Router>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </Router>
  );
}