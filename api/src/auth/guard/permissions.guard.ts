import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { PermissionAction, PermissionResource } from 'generated/prisma/enums';
import { TOKEN_PAYLOAD } from '../commom/auth.constant';

export const PERMISSIONS_KEY = 'permissions';

export interface RequiredPermission {
  resource: PermissionResource;
  action: PermissionAction;
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      RequiredPermission[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request[TOKEN_PAYLOAD];

    if (!user || !user.sub) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    // Buscar permissões do usuário
    const userPermissions = await this.prismaService.userPermission.findMany({
      where: {
        userId: user.sub,
      },
      select: {
        resource: true,
        action: true,
      },
    });

    // Verificar se o usuário tem todas as permissões necessárias
    const hasAllPermissions = requiredPermissions.every((required) =>
      userPermissions.some(
        (permission) =>
          permission.resource === required.resource &&
          permission.action === required.action,
      ),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        'Você não tem permissão para realizar esta ação',
      );
    }

    return true;
  }
}
