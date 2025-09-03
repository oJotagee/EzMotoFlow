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
exports.ClientsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ClientsService = class ClientsService {
    prismaService;
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getAll(filter) {
        try {
            const { limit = 10, offset = 0, status = '', nome = '', tipo = '', } = filter;
            const page = Math.floor(offset / limit) + 1;
            const whereConditions = {
                ...(status && { status }),
                ...(nome && {
                    fullName: {
                        contains: nome,
                        mode: 'insensitive',
                    },
                }),
                ...(tipo && { tipo: { equals: tipo } }),
            };
            const total = await this.prismaService.clients.count({
                where: whereConditions,
            });
            const clients = await this.prismaService.clients.findMany({
                select: {
                    id: true,
                    tipo: true,
                    fullName: true,
                    documento: true,
                    telefone: true,
                    email: true,
                    dataNascimento: true,
                    companyName: true,
                    status: true,
                },
                where: whereConditions,
                take: limit,
                skip: offset,
                orderBy: {
                    created_at: 'asc',
                },
            });
            const pages = Math.ceil(total / limit);
            return {
                data: clients,
                total,
                page,
                limit,
                pages,
            };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to get all clients', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getOne(id) {
        try {
            const clients = await this.prismaService.clients.findFirst({
                where: { id: id },
                select: {
                    id: true,
                    tipo: true,
                    fullName: true,
                    documento: true,
                    telefone: true,
                    email: true,
                    dataNascimento: true,
                    companyName: true,
                    status: true,
                    cep: true,
                    rua: true,
                    numero: true,
                    bairro: true,
                    cidade: true,
                    estado: true,
                    complementos: true,
                },
            });
            if (!clients)
                throw new common_1.HttpException('Clients not found', common_1.HttpStatus.NOT_FOUND);
            return clients;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to get clients', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createOne(body) {
        try {
            const existingByDocument = await this.prismaService.clients.findUnique({
                where: { documento: body.documento },
            });
            if (existingByDocument)
                throw new common_1.HttpException('Document is already registered.', common_1.HttpStatus.CONFLICT);
            const existingByemail = await this.prismaService.clients.findUnique({
                where: { email: body.email },
            });
            if (existingByemail)
                throw new common_1.HttpException('Email is already registered.', common_1.HttpStatus.CONFLICT);
            const newClients = await this.prismaService.clients.create({
                data: {
                    tipo: body.tipo,
                    fullName: body.fullName,
                    documento: body.documento,
                    telefone: body.telefone,
                    email: body.email,
                    dataNascimento: body.dataNascimento
                        ? new Date(body.dataNascimento)
                        : null,
                    companyName: body.companyName,
                    cep: body.cep,
                    rua: body.rua,
                    numero: body.numero,
                    bairro: body.bairro,
                    cidade: body.cidade,
                    estado: body.estado,
                    complementos: body.complementos,
                },
                select: {
                    id: true,
                    tipo: true,
                    fullName: true,
                    documento: true,
                    telefone: true,
                    email: true,
                    dataNascimento: true,
                    companyName: true,
                    status: true,
                },
            });
            return newClients;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error creating motorcycle', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateOne(id, body) {
        try {
            if (body.documento) {
                const existingByDocument = await this.prismaService.clients.findFirst({
                    where: {
                        documento: body.documento,
                        id: { not: id },
                    },
                });
                if (existingByDocument)
                    throw new common_1.HttpException('Document is already registered.', common_1.HttpStatus.CONFLICT);
            }
            if (body.email) {
                const existingByemail = await this.prismaService.clients.findFirst({
                    where: {
                        email: body.email,
                        id: { not: id },
                    },
                });
                if (existingByemail)
                    throw new common_1.HttpException('Email is already registered.', common_1.HttpStatus.CONFLICT);
            }
            const findClient = await this.prismaService.clients.findFirst({
                where: {
                    id: id,
                },
            });
            if (!findClient)
                throw new common_1.HttpException('Clients not found', common_1.HttpStatus.NOT_FOUND);
            const clientUpdated = await this.prismaService.clients.update({
                where: {
                    id: findClient.id,
                },
                data: {
                    ...body,
                    dataNascimento: body.dataNascimento
                        ? new Date(body.dataNascimento)
                        : undefined,
                    updated_at: new Date(),
                },
                select: {
                    id: true,
                    tipo: true,
                    fullName: true,
                    documento: true,
                    telefone: true,
                    email: true,
                    dataNascimento: true,
                    companyName: true,
                    status: true,
                },
            });
            return clientUpdated;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error updating clients', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteOne(id) {
        try {
            const findClient = await this.prismaService.clients.findFirst({
                where: {
                    id: id,
                },
            });
            if (!findClient)
                throw new common_1.HttpException('Client not found', common_1.HttpStatus.NOT_FOUND);
            await this.prismaService.clients.delete({
                where: {
                    id: id,
                },
            });
            return { message: 'Client deleted successfully' };
        }
        catch (error) {
            throw new common_1.HttpException('Error deleting client', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ClientsService = ClientsService;
exports.ClientsService = ClientsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClientsService);
//# sourceMappingURL=clients.service.js.map