"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const hashing_service_1 = require("./hash/hashing.service");
const bcrypt_service_1 = require("./hash/bcrypt.service");
const config_1 = require("@nestjs/config");
const jwt_config_1 = require("./config/jwt.config");
const jwt_1 = require("@nestjs/jwt");
const prisma_module_1 = require("../prisma/prisma.module");
const auth_controller_1 = require("./auth.controller");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            config_1.ConfigModule.forFeature(jwt_config_1.default),
            jwt_1.JwtModule.registerAsync(jwt_config_1.default.asProvider())
        ],
        providers: [
            {
                provide: hashing_service_1.HashingProtocol,
                useClass: bcrypt_service_1.BcryptService
            },
            auth_service_1.AuthService
        ],
        exports: [
            hashing_service_1.HashingProtocol,
            jwt_1.JwtModule,
            config_1.ConfigModule
        ],
        controllers: [auth_controller_1.AuthController]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map