"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const hashing_service_1 = require("./hash/hashing.service");
const jwt_config_1 = require("./config/jwt.config");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    prisma;
    hashingService;
    jwtConfiguration;
    jwtService;
    constructor(prisma, hashingService, jwtConfiguration, jwtService) {
        this.prisma = prisma;
        this.hashingService = hashingService;
        this.jwtConfiguration = jwtConfiguration;
        this.jwtService = jwtService;
    }
    async autenticate(LoginDto) {
        try {
            const findUser = await this.prisma.users.findFirst({
                where: {
                    email: LoginDto.email
                }
            });
            if (!findUser)
                throw new common_1.HttpException("User login error", common_1.HttpStatus.UNAUTHORIZED);
            const passwordValidated = await this.hashingService.compare(LoginDto.password, findUser.password);
            if (!passwordValidated)
                throw new common_1.HttpException("Incorrect username/password", common_1.HttpStatus.UNAUTHORIZED);
            const token = await this.jwtService.signAsync({
                sub: findUser.id,
                email: findUser.email
            }, {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                expiresIn: this.jwtConfiguration.jwtTtl,
            });
            return {
                id: findUser.id,
                name: findUser.name,
                email: findUser.email,
                token: token
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message ? error.message : "Error creating task", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(jwt_config_1.default.KEY)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        hashing_service_1.HashingProtocol, void 0, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map