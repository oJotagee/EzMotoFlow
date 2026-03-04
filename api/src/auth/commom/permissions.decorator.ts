import { SetMetadata } from '@nestjs/common';
import { PermissionAction, PermissionResource } from 'generated/prisma/enums';
import {
  PERMISSIONS_KEY,
  RequiredPermission,
} from '../guard/permissions.guard';

export const RequirePermissions = (
  ...permissions: RequiredPermission[]
): ReturnType<typeof SetMetadata> => SetMetadata(PERMISSIONS_KEY, permissions);

// Helper functions para facilitar o uso
export const CanReadUsers = () =>
  RequirePermissions({
    resource: PermissionResource.USERS,
    action: PermissionAction.READ,
  });

export const CanCreateUsers = () =>
  RequirePermissions({
    resource: PermissionResource.USERS,
    action: PermissionAction.CREATE,
  });

export const CanUpdateUsers = () =>
  RequirePermissions({
    resource: PermissionResource.USERS,
    action: PermissionAction.UPDATE,
  });

export const CanDeleteUsers = () =>
  RequirePermissions({
    resource: PermissionResource.USERS,
    action: PermissionAction.DELETE,
  });

export const CanReadClients = () =>
  RequirePermissions({
    resource: PermissionResource.CLIENTS,
    action: PermissionAction.READ,
  });

export const CanCreateClients = () =>
  RequirePermissions({
    resource: PermissionResource.CLIENTS,
    action: PermissionAction.CREATE,
  });

export const CanUpdateClients = () =>
  RequirePermissions({
    resource: PermissionResource.CLIENTS,
    action: PermissionAction.UPDATE,
  });

export const CanDeleteClients = () =>
  RequirePermissions({
    resource: PermissionResource.CLIENTS,
    action: PermissionAction.DELETE,
  });

export const CanReadMotorcycles = () =>
  RequirePermissions({
    resource: PermissionResource.MOTORCYCLES,
    action: PermissionAction.READ,
  });

export const CanCreateMotorcycles = () =>
  RequirePermissions({
    resource: PermissionResource.MOTORCYCLES,
    action: PermissionAction.CREATE,
  });

export const CanUpdateMotorcycles = () =>
  RequirePermissions({
    resource: PermissionResource.MOTORCYCLES,
    action: PermissionAction.UPDATE,
  });

export const CanDeleteMotorcycles = () =>
  RequirePermissions({
    resource: PermissionResource.MOTORCYCLES,
    action: PermissionAction.DELETE,
  });

export const CanReadContracts = () =>
  RequirePermissions({
    resource: PermissionResource.CONTRACTS,
    action: PermissionAction.READ,
  });

export const CanCreateContracts = () =>
  RequirePermissions({
    resource: PermissionResource.CONTRACTS,
    action: PermissionAction.CREATE,
  });

export const CanUpdateContracts = () =>
  RequirePermissions({
    resource: PermissionResource.CONTRACTS,
    action: PermissionAction.UPDATE,
  });

export const CanDeleteContracts = () =>
  RequirePermissions({
    resource: PermissionResource.CONTRACTS,
    action: PermissionAction.DELETE,
  });
