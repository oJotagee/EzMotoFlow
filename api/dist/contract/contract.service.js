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
const mail_service_1 = require("../mail/mail.service");
let ContractService = class ContractService {
    prismaService;
    emailService;
    constructor(prismaService, emailService) {
        this.prismaService = prismaService;
        this.emailService = emailService;
    }
    async getAll(filter) {
        try {
            const { limit = 10, offset = 0, status, nomeCliente, documentoCliente, placa, renavam, dataInicio, dataFim, } = filter;
            const page = Math.floor(offset / limit) + 1;
            const whereConditions = {
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
            };
            const total = await this.prismaService.contracts.count({
                where: whereConditions,
            });
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
                    created_at: true,
                    updated_at: true,
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
                data: contracts,
                total,
                page,
                limit,
                pages,
            };
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
                    motorcycleId: true,
                    signatures: true,
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
            const findMotorcycle = await this.prismaService.motorCycle.findFirst({
                where: { id: body.motorcycleId, status: 'ativo' },
            });
            if (!findMotorcycle) {
                throw new common_1.HttpException(`Motorcycle with ID ${body.motorcycleId} not found`, common_1.HttpStatus.NOT_FOUND);
            }
            const findClient = await this.prismaService.clients.findFirst({
                where: { id: body.clientId },
            });
            if (!findClient) {
                throw new common_1.HttpException(`Client with ID ${body.clientId} not found`, common_1.HttpStatus.NOT_FOUND);
            }
            const existingActiveContract = await this.prismaService.contracts.findFirst({
                where: {
                    motorcycleId: body.motorcycleId,
                    status: 'ativo',
                },
            });
            if (existingActiveContract) {
                throw new common_1.HttpException('There is already an active contract for this motorcycle', common_1.HttpStatus.BAD_REQUEST);
            }
            const signatureToken = crypto.randomUUID();
            const tokenExpiry = new Date();
            tokenExpiry.setHours(tokenExpiry.getHours() + 48);
            const newContract = await this.prismaService.contracts.create({
                data: {
                    valor: findMotorcycle.valor_venda,
                    observacao: body.observacao,
                    pagamento: body.pagamento,
                    contractoPdf: '',
                    signatureToken,
                    signatureTokenExpiry: tokenExpiry,
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
                    signatureToken: true,
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
            await this.prismaService.motorCycle.update({
                where: { id: body.motorcycleId },
                data: { status: 'andamento' },
            });
            try {
                await this.emailService.sendSignatureLink(findClient.email, findClient.fullName, newContract.id, signatureToken);
            }
            catch (emailError) {
                console.error('Erro ao enviar email de assinatura:', emailError);
            }
            return newContract;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to create the contract', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
            await this.prismaService.contracts.update({
                where: {
                    id: findContract.id,
                },
                data: { status: 'cancelado' },
            });
            await this.prismaService.motorCycle.update({
                where: { id: findContract.motorcycleId },
                data: { status: 'ativo' },
            });
            return { message: 'Contract deleted successfully' };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to delete the contract', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async resendSignatureEmail(contractId) {
        try {
            const contract = await this.prismaService.contracts.findFirst({
                where: { id: contractId },
                include: {
                    client: true,
                    motorcycle: true,
                },
            });
            if (!contract) {
                throw new common_1.HttpException('Contract not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (!contract.signatureToken || !contract.signatureTokenExpiry) {
                throw new common_1.HttpException('Token de assinatura não encontrado para este contrato', common_1.HttpStatus.BAD_REQUEST);
            }
            if (contract.signatureTokenExpiry < new Date()) {
                const newToken = crypto.randomUUID();
                const tokenExpiry = new Date();
                tokenExpiry.setHours(tokenExpiry.getHours() + 48);
                await this.prismaService.contracts.update({
                    where: { id: contractId },
                    data: {
                        signatureToken: newToken,
                        signatureTokenExpiry: tokenExpiry,
                    },
                });
                await this.emailService.sendSignatureLink(contract.client.email, contract.client.fullName, contractId, newToken);
            }
            else {
                await this.emailService.sendSignatureLink(contract.client.email, contract.client.fullName, contractId, contract.signatureToken);
            }
            return { message: 'Email de assinatura reenviado com sucesso!' };
        }
        catch (error) {
            throw new common_1.HttpException('Erro ao reenviar email de assinatura', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getContractForSignature(contractId, token) {
        try {
            const contract = await this.prismaService.contracts.findFirst({
                where: {
                    id: contractId,
                    signatureToken: token,
                    signatureTokenExpiry: {
                        gt: new Date(),
                    },
                },
                include: {
                    client: true,
                    motorcycle: true,
                },
            });
            if (!contract) {
                throw new common_1.HttpException('Contrato não encontrado ou token inválido/expirado', common_1.HttpStatus.NOT_FOUND);
            }
            return contract;
        }
        catch (error) {
            throw new common_1.HttpException('Erro ao buscar contrato', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async signContract(contractId, token, signatureData) {
        try {
            const updatedContract = await this.prismaService.contracts.update({
                where: { id: contractId },
                data: {
                    signatures: signatureData,
                    signatureToken: null,
                    signatureTokenExpiry: null,
                    status: 'finalizado',
                },
                select: {
                    id: true,
                    valor: true,
                    data: true,
                    status: true,
                    observacao: true,
                    pagamento: true,
                    contractoPdf: true,
                    motorcycleId: true,
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
            await this.prismaService.motorCycle.update({
                where: { id: updatedContract.motorcycleId },
                data: { status: 'vendido' },
            });
            return {
                message: 'Contrato assinado com sucesso!',
                contract: updatedContract,
            };
        }
        catch (error) {
            throw new common_1.HttpException('Erro ao assinar contrato', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ContractService = ContractService;
exports.ContractService = ContractService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.EmailService])
], ContractService);
//# sourceMappingURL=contract.service.js.map