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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const hashing_service_1 = require("../auth/hash/hashing.service");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prismaService;
    hashingService;
    constructor(prismaService, hashingService) {
        this.prismaService = prismaService;
        this.hashingService = hashingService;
    }
    async getUser(tokenPayload) {
        try {
            const findUser = await this.prismaService.users.findFirst({
                where: { id: tokenPayload.sub },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    created_at: true,
                    updated_at: true,
                },
            });
            if (!findUser)
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            return findUser;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to get user', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(createUserDto) {
        try {
            const existingByEmail = await this.prismaService.users.findUnique({
                where: { email: createUserDto.email },
            });
            if (existingByEmail)
                throw new common_1.HttpException('A user with this email address is already registered.', common_1.HttpStatus.CONFLICT);
            const passwordHash = await this.hashingService.hash(createUserDto.password);
            const user = await this.prismaService.users.create({
                data: {
                    name: createUserDto.name,
                    email: createUserDto.email,
                    password: passwordHash,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    created_at: true,
                    updated_at: true,
                },
            });
            return user;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to create user', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(updateUserDto, tokenPayload) {
        try {
            const existingByEmail = await this.prismaService.users.findUnique({
                where: { email: updateUserDto.email },
            });
            if (existingByEmail && existingByEmail.id !== tokenPayload.sub)
                throw new common_1.HttpException('A user with this email address is already registered.', common_1.HttpStatus.CONFLICT);
            const findUser = await this.prismaService.users.findFirst({
                where: {
                    id: tokenPayload.sub,
                },
            });
            if (!findUser)
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            if (findUser.id !== tokenPayload.sub)
                throw new common_1.HttpException('You cannot update this user', common_1.HttpStatus.FORBIDDEN);
            const dataUser = {
                name: updateUserDto.name ? updateUserDto.name : findUser.name,
                email: updateUserDto.email ? updateUserDto.email : findUser.email,
            };
            if (updateUserDto.password) {
                const passwordHash = await this.hashingService.hash(updateUserDto.password);
                dataUser.password = passwordHash;
            }
            const user = await this.prismaService.users.update({
                where: {
                    id: findUser.id,
                },
                data: {
                    ...dataUser,
                    password: dataUser.password ? dataUser.password : findUser.password,
                    updated_at: new Date(),
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });
            return user;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to update user', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async delete(tokenPayload) {
        try {
            const findUser = await this.prismaService.users.findFirst({
                where: {
                    id: tokenPayload.sub,
                },
            });
            if (!findUser)
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            if (findUser.id !== tokenPayload.sub)
                throw new common_1.HttpException('You cannot delete this user', common_1.HttpStatus.FORBIDDEN);
            this.prismaService.users.delete({
                where: {
                    id: findUser.id,
                },
            });
            return {
                message: 'User deleted successfully',
            };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to delete user', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        hashing_service_1.HashingProtocol])
], UsersService);
//# sourceMappingURL=users.service.js.map