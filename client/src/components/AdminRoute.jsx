import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user } = useAuth();

  if (!user) {
    // If user is not logged in, redirect to login
    return <Navigate to="/login" />;
  }
  
  return user.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute; 