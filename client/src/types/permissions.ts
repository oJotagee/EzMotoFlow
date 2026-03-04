export enum PermissionResource {
  USERS = 'USERS',
  CLIENTS = 'CLIENTS',
  MOTORCYCLES = 'MOTORCYCLES',
  CONTRACTS = 'CONTRACTS',
}

export enum PermissionAction {
  READ = 'READ',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface UserPermission {
  id: string;
  resource: PermissionResource;
  action: PermissionAction;
  created_at: string;
}

export interface UserPermissionsResponse {
  userId: string;
  userName: string;
  permissions: UserPermission[];
}

export interface UpdateUserPermissionsDto {
  userId: string;
  permissions: {
    resource: PermissionResource;
    action: PermissionAction;
  }[];
}
