import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import { PermissionResource, PermissionAction } from '@/types/permissions';

interface PermissionGuardProps {
  resource: PermissionResource;
  action: PermissionAction;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGuard = ({
  resource,
  action,
  children,
  fallback = null,
}: PermissionGuardProps) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
