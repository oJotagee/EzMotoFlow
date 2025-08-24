import { PrismaService } from 'src/prisma/prisma.service';
import { HashingProtocol } from './hash/hashing.service';
import { ResponseAuthDto } from './dto/response.dto';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private readonly hashingService;
    private readonly jwtConfiguration;
    private readonly jwtService;
    constructor(prisma: PrismaService, hashingService: HashingProtocol, jwtConfiguration: ConfigType<typeof jwtConfig>, jwtService: JwtService);
    autenticate(LoginDto: LoginDto): Promise<ResponseAuthDto>;
}
