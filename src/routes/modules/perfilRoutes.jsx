import { Route } from 'react-router-dom';
import Perfil from '../../Components/features/Perfil/Perfil';
import ProtectedRoute from '../ProtectedRoute';

const perfilRoutes = [
  <Route 
    key="perfil" 
    path="/perfil" 
    element={
      <ProtectedRoute>
        <Perfil />
      </ProtectedRoute>
    } 
  />
];

export default perfilRoutes;