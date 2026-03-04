import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPermission, PermissionResource, PermissionAction } from '../types/permissions';

interface PermissionsState {
  permissions: UserPermission[];
  setPermissions: (permissions: UserPermission[]) => void;
  hasPermission: (resource: PermissionResource, action: PermissionAction) => boolean;
  clearPermissions: () => void;
}

export const usePermissionsStore = create<PermissionsState>()(
  persist(
    (set, get) => ({
      permissions: [],

      setPermissions: (permissions) => set({ permissions }),

      hasPermission: (resource, action) => {
        const { permissions } = get();
        return permissions.some(
          (permission) =>
            permission.resource === resource && permission.action === action
        );
      },

      clearPermissions: () => set({ permissions: [] }),
    }),
    {
      name: 'permissions-storage',
    }
  )
);
