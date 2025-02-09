import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from './components/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthorized, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }


  return children;
};

export default ProtectedRoute;