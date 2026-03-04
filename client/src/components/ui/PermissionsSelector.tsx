import { useState, useEffect } from 'react';
import { Shield, Check } from 'lucide-react';
import { PermissionResource, PermissionAction } from '@/types/permissions';
import { Title } from './Title';
import { Subtitle } from './Subtitle';

interface Permission {
  resource: PermissionResource;
  action: PermissionAction;
}

interface PermissionsSelectorProps {
  selectedPermissions: Permission[];
  onChange: (permissions: Permission[]) => void;
  disabled?: boolean;
}

const resources = [
  { value: PermissionResource.USERS, label: 'Usuários' },
  { value: PermissionResource.CLIENTS, label: 'Clientes' },
  { value: PermissionResource.MOTORCYCLES, label: 'Motocicletas' },
  { value: PermissionResource.CONTRACTS, label: 'Contratos' },
];

const actions = [
  { value: PermissionAction.READ, label: 'Visualizar', color: 'text-blue-600 dark:text-blue-400' },
  { value: PermissionAction.CREATE, label: 'Criar', color: 'text-green-600 dark:text-green-400' },
  { value: PermissionAction.UPDATE, label: 'Editar', color: 'text-yellow-600 dark:text-yellow-400' },
  { value: PermissionAction.DELETE, label: 'Excluir', color: 'text-red-600 dark:text-red-400' },
];

export function PermissionsSelector({ selectedPermissions, onChange, disabled = false }: PermissionsSelectorProps) {
  const [permissions, setPermissions] = useState<Permission[]>(selectedPermissions);

  useEffect(() => {
    setPermissions(selectedPermissions);
  }, [selectedPermissions]);

  const hasPermission = (resource: PermissionResource, action: PermissionAction) => {
    return permissions.some(p => p.resource === resource && p.action === action);
  };

  const togglePermission = (resource: PermissionResource, action: PermissionAction) => {
    if (disabled) return;

    const exists = hasPermission(resource, action);
    let newPermissions: Permission[];

    if (exists) {
      newPermissions = permissions.filter(p => !(p.resource === resource && p.action === action));
    } else {
      newPermissions = [...permissions, { resource, action }];
    }

    setPermissions(newPermissions);
    onChange(newPermissions);
  };

  const toggleAllForResource = (resource: PermissionResource) => {
    if (disabled) return;

    const resourcePermissions = permissions.filter(p => p.resource === resource);
    const hasAll = resourcePermissions.length === actions.length;

    let newPermissions: Permission[];

    if (hasAll) {
      // Remove todas as permissões deste recurso
      newPermissions = permissions.filter(p => p.resource !== resource);
    } else {
      // Adiciona todas as permissões deste recurso
      const otherPermissions = permissions.filter(p => p.resource !== resource);
      const allResourcePermissions = actions.map(action => ({
        resource,
        action: action.value
      }));
      newPermissions = [...otherPermissions, ...allResourcePermissions];
    }

    setPermissions(newPermissions);
    onChange(newPermissions);
  };

  const isAllSelected = (resource: PermissionResource) => {
    const resourcePermissions = permissions.filter(p => p.resource === resource);
    return resourcePermissions.length === actions.length;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-muted-foreground" />
        <Title size="lg" className="text-card-foreground">
          Permissões
        </Title>
      </div>
      <Subtitle className="text-muted-foreground">
        Selecione as permissões que o usuário terá acesso
      </Subtitle>

      <div className="space-y-3">
        {resources.map((resource) => (
          <div
            key={resource.value}
            className="bg-muted/50 dark:bg-muted/30 border border-border rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Title size="sm" className="text-card-foreground">
                  {resource.label}
                </Title>
              </div>
              <button
                type="button"
                onClick={() => toggleAllForResource(resource.value)}
                disabled={disabled}
                className={`
                  text-xs font-medium px-3 py-1 rounded-md transition-colors
                  ${isAllSelected(resource.value)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:bg-primary/10'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {isAllSelected(resource.value) ? 'Desmarcar Todas' : 'Selecionar Todas'}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {actions.map((action) => {
                const isSelected = hasPermission(resource.value, action.value);
                return (
                  <button
                    key={action.value}
                    type="button"
                    onClick={() => togglePermission(resource.value, action.value)}
                    disabled={disabled}
                    className={`
                      flex items-center justify-between gap-2 p-3 rounded-md border-2 transition-all
                      ${isSelected
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border bg-background hover:border-primary/50'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <span className={`text-sm font-medium ${isSelected ? action.color : 'text-muted-foreground'}`}>
                      {action.label}
                    </span>
                    {isSelected && (
                      <Check className={`w-4 h-4 ${action.color}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-400">
          <strong>Total de permissões selecionadas:</strong> {permissions.length}
        </p>
      </div>
    </div>
  );
}
