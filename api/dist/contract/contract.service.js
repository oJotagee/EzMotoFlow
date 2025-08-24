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
exports.ContractService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ContractService = class ContractService {
    prismaService;
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getAll(filter) {
        try {
            const { limit = 6, offset = 0, status, nomeCliente, documentoCliente, placa, renavam, dataInicio, dataFim, } = filter;
            const contracts = await this.prismaService.contracts.findMany({
                select: {
                    id: true,
                    valor: true,
                    data: true,
                    status: true,
                    observacao: true,
                    pagamento: true,
                    contractoPdf: true,
                    motorcycle: {
                        select: {
                            id: true,
                            nome: true,
                            placa: true,
                            renavam: true,
                            chassi: true,
                            ano: true,
                        },
                    },
                    client: {
                        select: {
                            id: true,
                            fullName: true,
                            documento: true,
                            telefone: true,
                            email: true,
                            dataNascimento: true,
                            companyName: true,
                        },
                    },
                },
                where: {
                    ...(status && { status }),
                    ...(nomeCliente && {
                        client: {
                            fullName: {
                                contains: nomeCliente,
                                mode: 'insensitive',
                            },
                        },
                    }),
                    ...(documentoCliente && {
                        client: {
                            documento: {
                                contains: documentoCliente,
                                mode: 'insensitive',
                            },
                        },
                    }),
                    ...(placa && {
                        motorcycle: {
                            placa: {
                                contains: placa,
                                mode: 'insensitive',
                            },
                        },
                    }),
                    ...(renavam && {
                        motorcycle: {
                            renavam: {
                                contains: renavam,
                                mode: 'insensitive',
                            },
                        },
                    }),
                    ...(dataInicio !== undefined && dataFim !== undefined
                        ? {
                            data: {
                                gte: new Date(`${dataInicio}-01-01T00:00:00.000Z`),
                                lte: new Date(`${dataFim}-12-31T23:59:59.999Z`),
                            },
                        }
                        : dataInicio !== undefined
                            ? {
                                data: {
                                    gte: new Date(`${dataInicio}-01-01T00:00:00.000Z`),
                                },
                            }
                            : dataFim !== undefined
                                ? {
                                    data: {
                                        lte: new Date(`${dataFim}-12-31T23:59:59.999Z`),
                                    },
                                }
                                : {}),
                },
                take: limit,
                skip: offset,
                orderBy: {
                    created_at: 'asc',
                },
            });
            return contracts;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to get all contracts', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getOne(id) {
        try {
            const contract = await this.prismaService.contracts.findFirst({
                where: { id: id },
                select: {
                    id: true,
                    valor: true,
                    data: true,
                    status: true,
                    observacao: true,
                    pagamento: true,
                    contractoPdf: true,
                    motorcycle: {
                        select: {
                            id: true,
                            nome: true,
                            placa: true,
                            renavam: true,
                            chassi: true,
                            ano: true,
                        },
                    },
                    client: {
                        select: {
                            id: true,
                            fullName: true,
                            documento: true,
                            telefone: true,
                            email: true,
                            dataNascimento: true,
                            companyName: true,
                        },
                    },
                },
            });
            if (!contract) {
                throw new common_1.HttpException('Contract not found', common_1.HttpStatus.NOT_FOUND);
            }
            return contract;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to get the contract', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createOne(body) {
        try {
            const existingByContract = await this.prismaService.contracts.findFirst({
                where: {
                    motorcycleId: body.motorcycleId,
                    clientId: body.clientId,
                },
            });
            if (existingByContract)
                throw new common_1.HttpException('Contract already exists for this client and motorcycle', common_1.HttpStatus.BAD_REQUEST);
            const findMotorcycle = await this.prismaService.motorCycle.findFirst({
                where: { id: body.motorcycleId },
            });
            if (!findMotorcycle)
                throw new common_1.HttpException('Motorcycle not found', common_1.HttpStatus.NOT_FOUND);
            const findClient = await this.prismaService.clients.findFirst({
                where: { id: body.clientId },
            });
            if (!findClient)
                throw new common_1.HttpException('Client not found', common_1.HttpStatus.NOT_FOUND);
            const newContract = await this.prismaService.contracts.create({
                data: {
                    valor: findMotorcycle.valor_venda,
                    observacao: body.observacao,
                    pagamento: body.pagamento,
                    contractoPdf: body.contractoPdf,
                    motorcycleId: body.motorcycleId,
                    clientId: body.clientId,
                },
                select: {
                    id: true,
                    valor: true,
                    data: true,
                    status: true,
                    observacao: true,
                    pagamento: true,
                    contractoPdf: true,
                    motorcycle: {
                        select: {
                            id: true,
                            nome: true,
                            placa: true,
                            renavam: true,
                            chassi: true,
                            ano: true,
                        },
                    },
                    client: {
                        select: {
                            id: true,
                            fullName: true,
                            documento: true,
                            telefone: true,
                            email: true,
                            dataNascimento: true,
                            companyName: true,
                        },
                    },
                },
            });
            return newContract;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to create the contract', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteOne(id) {
        try {
            const findContract = await this.prismaService.contracts.findFirst({
                where: {
                    id: id,
                },
            });
            if (!findContract) {
                throw new common_1.HttpException('Contract not found', common_1.HttpStatus.NOT_FOUND);
            }
            await this.prismaService.contracts.delete({
                where: {
                    id: findContract.id,
                },
            });
            return { message: 'Contract deleted successfully' };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to delete the contract', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ContractService = ContractService;
exports.ContractService = ContractService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractService);
//# sourceMappingURL=contract.service.js.map