import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../store/AuthContext';

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user?.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
};

export default RoleBasedRoute;
