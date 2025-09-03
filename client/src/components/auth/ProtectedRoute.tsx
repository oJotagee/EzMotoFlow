import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import { ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const token = Cookies.get('user-auth');

  useEffect(() => {
    if (!token && isAuthenticated) {
      logout();
    }
  }, [token, isAuthenticated, logout]);

  if (!isAuthenticated || !token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}