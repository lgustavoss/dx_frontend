import { Route } from 'react-router-dom';
import ListarCliente from '../../Components/features/Cliente/ListarCliente/ListarCliente';
import DetalheCliente from '../../Components/features/Cliente/DetalheCliente/DetalheCliente';
import CadastroCliente from '../../Components/features/Cliente/CadastroCliente/CadastroCliente';
import ProtectedRoute from '../ProtectedRoute';

const clienteRoutes = [
  <Route 
    key="listar-clientes" 
    path="/clientes" 
    element={
      <ProtectedRoute>
        <ListarCliente />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="detalhe-cliente" 
    path="/cliente/:id" 
    element={
      <ProtectedRoute>
        <DetalheCliente />
      </ProtectedRoute>
    } 
  />,
  <Route 
    key="cadastro-cliente" 
    path="/cadastro-cliente" 
    element={
      <ProtectedRoute>
        <CadastroCliente />
      </ProtectedRoute>
    } 
  />
];

export default clienteRoutes;