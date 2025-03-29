import { Route } from 'react-router-dom';
import ListarUsuario from '../../Components/features/Usuario/ListarUsuario/ListarUsuario';
import CadastroUsuario from '../../Components/features/Usuario/CadastroUsuario/CadastroUsuario';
import DetalheUsuario from '../../Components/features/Usuario/DetalheUsuario/DetalheUsuario';
import ProtectedRoute from '../ProtectedRoute';

const usuarioRoutes = [
  <Route 
    key="listar-usuarios" 
    path="/usuarios" 
    element={
      <ProtectedRoute>
        <ListarUsuario />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="cadastro-usuario" 
    path="/cadastro" 
    element={
      <ProtectedRoute>
        <CadastroUsuario />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="detalhe-usuario" 
    path="/usuario/:id" 
    element={
      <ProtectedRoute>
        <DetalheUsuario />
      </ProtectedRoute>
    } 
  />
];

export default usuarioRoutes;