
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PrivateRoute = ({ children }:any) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    // You can return a loading spinner or skeleton here
    return <div>Loading...</div>;
  }
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
