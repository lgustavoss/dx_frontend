import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth/AuthContext';
import Navbar from '../Components/ui/Navigation/Navbar/Navbar';
import Sidebar from '../Components/ui/Navigation/Sidebar/Sidebar';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return null;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <>
      <Navbar />
      <Sidebar />
      {children}
    </>
  );
};

export default ProtectedRoute;