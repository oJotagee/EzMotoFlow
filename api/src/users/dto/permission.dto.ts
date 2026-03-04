import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionAction, PermissionResource } from 'generated/prisma/enums';

export class CreatePermissionDto {
  @IsString()
  userId: string;

  @IsEnum(PermissionResource)
  resource: PermissionResource;

  @IsEnum(PermissionAction)
  action: PermissionAction;
}

export class PermissionDto {
  @IsEnum(PermissionResource)
  resource: PermissionResource;

  @IsEnum(PermissionAction)
  action: PermissionAction;
}

export class UpdateUserPermissionsDto {
  @IsString()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}
