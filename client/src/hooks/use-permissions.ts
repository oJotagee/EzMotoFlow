import { usePermissionsStore } from '../stores/permissions';
import { PermissionResource, PermissionAction } from '../types/permissions';

export const usePermissions = () => {
  const { permissions, hasPermission } = usePermissionsStore();

  return {
    permissions,
    hasPermission,

    // Usuários
    canReadUsers: () => hasPermission(PermissionResource.USERS, PermissionAction.READ),
    canCreateUsers: () => hasPermission(PermissionResource.USERS, PermissionAction.CREATE),
    canUpdateUsers: () => hasPermission(PermissionResource.USERS, PermissionAction.UPDATE),
    canDeleteUsers: () => hasPermission(PermissionResource.USERS, PermissionAction.DELETE),

    // Clientes
    canReadClients: () => hasPermission(PermissionResource.CLIENTS, PermissionAction.READ),
    canCreateClients: () => hasPermission(PermissionResource.CLIENTS, PermissionAction.CREATE),
    canUpdateClients: () => hasPermission(PermissionResource.CLIENTS, PermissionAction.UPDATE),
    canDeleteClients: () => hasPermission(PermissionResource.CLIENTS, PermissionAction.DELETE),

    // Motocicletas
    canReadMotorcycles: () => hasPermission(PermissionResource.MOTORCYCLES, PermissionAction.READ),
    canCreateMotorcycles: () => hasPermission(PermissionResource.MOTORCYCLES, PermissionAction.CREATE),
    canUpdateMotorcycles: () => hasPermission(PermissionResource.MOTORCYCLES, PermissionAction.UPDATE),
    canDeleteMotorcycles: () => hasPermission(PermissionResource.MOTORCYCLES, PermissionAction.DELETE),

    // Contratos
    canReadContracts: () => hasPermission(PermissionResource.CONTRACTS, PermissionAction.READ),
    canCreateContracts: () => hasPermission(PermissionResource.CONTRACTS, PermissionAction.CREATE),
    canUpdateContracts: () => hasPermission(PermissionResource.CONTRACTS, PermissionAction.UPDATE),
    canDeleteContracts: () => hasPermission(PermissionResource.CONTRACTS, PermissionAction.DELETE),
  };
};
