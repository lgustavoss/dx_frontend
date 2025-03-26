import './App.css'
import Login from './Components/features/Auth/Login/Login'
import ListarUsuario from './Components/features/Usuario/ListarUsuario/ListarUsuario'
import Perfil from './Components/features/Perfil/Perfil'
import CadastroUsuario from './Components/features/Usuario/CadastroUsuario/CadastroUsuario'
import ListarCliente from './Components/features/Cliente/ListarCliente/ListarCliente'
import CadastroCliente from './Components/features/Cliente/CadastroCliente/CadastroCliente'
import DetalheCliente from './Components/features/Cliente/DetalheCliente/DetalheCliente';
import { Navbar } from './Components/ui/Navigation';
import { Sidebar } from './Components/ui/Navigation';
import { SidebarProvider, SidebarContext } from './Components/ui/Navigation/Sidebar/SidebarContext';
import { AlertProvider } from './Components/ui/Feedback/Alert/AlertContext';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
 


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
          <Route path="/clientes" element={<ListarCliente />} />
          <Route path="/cadastro-cliente" element={<CadastroCliente />} />
          <Route path="/cliente/:id" element={<DetalheCliente />} />
        </Routes>
      </div>
    </div>
  )
}

export default function AppWrapper() {
  return (
    <Router>
      <SidebarProvider>
        <AlertProvider>
          <App />
        </AlertProvider>
      </SidebarProvider>
    </Router>
  );
}