import { Routes, Route, Navigate } from 'react-router-dom';
import authRoutes from './modules/authRoutes';
import clienteRoutes from './modules/clienteRoutes';
import usuarioRoutes from './modules/usuarioRoutes';
import perfilRoutes from './modules/perfilRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas de autenticação */}
      {authRoutes}
      
      {/* Rotas de usuários */}
      {usuarioRoutes}
      
      {/* Rotas de clientes */}
      {clienteRoutes}
      
      {/* Rotas de perfil */}
      {perfilRoutes}
      
      {/* Rota fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;