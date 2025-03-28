import { Route } from 'react-router-dom';
import Login from '../../Components/features/Auth/Login/Login';

const authRoutes = [
  <Route key="login" path="/" element={<Login />} />
];

export default authRoutes;