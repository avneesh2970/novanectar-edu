// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AdminProtectedRoute = ({ children }:any) => {
  const { isAdminAuthenticated } = useAuth();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;