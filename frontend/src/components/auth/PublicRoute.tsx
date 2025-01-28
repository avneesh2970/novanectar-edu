
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PublicRoute = ({ children }:any) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PublicRoute;