import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/stores/auth";
import { usePermissionsStore } from "@/stores/permissions";
import { authService } from "@/services/auth.service";
import { ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, logout, user } = useAuth();
  const { setPermissions } = usePermissionsStore();
  const location = useLocation();
  const token = Cookies.get("user-auth");
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  useEffect(() => {
    if (!token && isAuthenticated) {
      logout();
    }
  }, [token, isAuthenticated, logout]);

  useEffect(() => {
    if (isAuthenticated && token && user?.id) {
      setLoadingPermissions(true);
      authService.getUserPermissions(user.id)
        .then((data) => {
          setPermissions(data.permissions);
        })
        .catch(console.error)
        .finally(() => setLoadingPermissions(false));
    } else {
      setLoadingPermissions(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!isAuthenticated || !token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (loadingPermissions) {
    return null;
  }

  return <>{children}</>;
}
