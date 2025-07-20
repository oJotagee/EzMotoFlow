import { CanActivate, ExecutionContext } from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
export declare class AuthTokenGuard implements CanActivate {
    private readonly jwtService;
    private jwtConfiguraton;
    constructor(jwtService: JwtService, jwtConfiguraton: ConfigType<typeof jwtConfig>);
    canActivate(context: ExecutionContext): Promise<boolean>;
    extractToken(request: Request): string | undefined;
}
