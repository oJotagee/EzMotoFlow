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
exports.MotorcycleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const aws_s3_service_1 = require("../aws/aws-s3.service");
let MotorcycleService = class MotorcycleService {
    prismaService;
    s3Service;
    constructor(prismaService, s3Service) {
        this.prismaService = prismaService;
        this.s3Service = s3Service;
    }
    async getAll(filter) {
        try {
            const { limit = 6, offset = 0, status = '', placa = '', nome = '', anoMin, anoMax, } = filter;
            const motorcycles = await this.prismaService.motorCycle.findMany({
                select: {
                    id: true,
                    nome: true,
                    cor: true,
                    placa: true,
                    ano: true,
                    chassi: true,
                    renavam: true,
                    km: true,
                    valor_compra: true,
                    valor_venda: true,
                    valor_fipe: true,
                    observacao: true,
                    status: true,
                    created_at: true,
                    updated_at: true,
                },
                where: {
                    ...(status && { status }),
                    ...(placa && {
                        placa: {
                            contains: placa,
                            mode: 'insensitive',
                        },
                    }),
                    ...(nome && {
                        nome: {
                            contains: nome,
                            mode: 'insensitive',
                        },
                    }),
                    ...(anoMin !== undefined && anoMax !== undefined
                        ? {
                            ano: {
                                gte: new Date(`${anoMin}-01-01T00:00:00.000Z`),
                                lte: new Date(`${anoMax}-12-31T23:59:59.999Z`),
                            },
                        }
                        : anoMin !== undefined
                            ? {
                                ano: {
                                    gte: new Date(`${anoMin}-01-01T00:00:00.000Z`),
                                },
                            }
                            : anoMax !== undefined
                                ? {
                                    ano: {
                                        lte: new Date(`${anoMax}-12-31T23:59:59.999Z`),
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
            return motorcycles;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to get all motorcycles', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getOne(id) {
        try {
            const motorcycle = await this.prismaService.motorCycle.findFirst({
                where: { id: id },
                select: {
                    id: true,
                    nome: true,
                    cor: true,
                    placa: true,
                    ano: true,
                    chassi: true,
                    renavam: true,
                    km: true,
                    valor_compra: true,
                    valor_venda: true,
                    valor_fipe: true,
                    observacao: true,
                    status: true,
                    foto1: true,
                    foto2: true,
                    foto3: true,
                    created_at: true,
                    updated_at: true,
                },
            });
            if (!motorcycle)
                throw new common_1.HttpException('Motorcycle not found', common_1.HttpStatus.NOT_FOUND);
            return motorcycle;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to get motorcycle', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async createOne(body) {
        try {
            const fotos = [body.foto1, body.foto2, body.foto3];
            const existingByPlate = await this.prismaService.motorCycle.findUnique({
                where: { placa: body.placa },
            });
            if (existingByPlate)
                throw new common_1.HttpException('Plate is already registered.', common_1.HttpStatus.CONFLICT);
            const existingByChassi = await this.prismaService.motorCycle.findUnique({
                where: { chassi: body.chassi },
            });
            if (existingByChassi)
                throw new common_1.HttpException('Chassi is already registered.', common_1.HttpStatus.CONFLICT);
            const existingByRenavam = await this.prismaService.motorCycle.findUnique({
                where: { renavam: body.renavam },
            });
            if (existingByRenavam)
                throw new common_1.HttpException('Renavam is already registered.', common_1.HttpStatus.CONFLICT);
            const fotoUrls = await Promise.all(fotos.map((foto) => foto && foto !== ''
                ? this.s3Service.uploadBase64Image(foto)
                : Promise.resolve(null)));
            const [fotoUrl1, fotoUrl2, fotoUrl3] = fotoUrls;
            const newMotorcycle = await this.prismaService.motorCycle.create({
                data: {
                    nome: body.nome,
                    cor: body.cor,
                    placa: body.placa,
                    ano: new Date(body.ano),
                    chassi: body.chassi,
                    renavam: body.renavam,
                    km: body.km,
                    valor_compra: body.valor_compra,
                    valor_venda: body.valor_venda,
                    valor_fipe: body.valor_fipe,
                    observacao: body.observacao,
                    foto1: fotoUrl1,
                    foto2: fotoUrl2,
                    foto3: fotoUrl3,
                },
                select: {
                    id: true,
                    nome: true,
                    cor: true,
                    placa: true,
                    ano: true,
                    chassi: true,
                    renavam: true,
                    km: true,
                    valor_compra: true,
                    valor_venda: true,
                    valor_fipe: true,
                    observacao: true,
                    status: true,
                    foto1: true,
                    foto2: true,
                    foto3: true,
                    created_at: true,
                    updated_at: true,
                },
            });
            return newMotorcycle;
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
            if (body.placa) {
                const existingByPlate = await this.prismaService.motorCycle.findFirst({
                    where: {
                        placa: body.placa,
                        id: { not: id },
                    },
                });
                if (existingByPlate) {
                    throw new common_1.HttpException('Plate is already registered.', common_1.HttpStatus.CONFLICT);
                }
            }
            if (body.chassi) {
                const existingByChassi = await this.prismaService.motorCycle.findFirst({
                    where: {
                        chassi: body.chassi,
                        id: { not: id },
                    },
                });
                if (existingByChassi) {
                    throw new common_1.HttpException('Chassi is already registered.', common_1.HttpStatus.CONFLICT);
                }
            }
            if (body.renavam) {
                const existingByRenavam = await this.prismaService.motorCycle.findFirst({
                    where: {
                        renavam: body.renavam,
                        id: { not: id },
                    },
                });
                if (existingByRenavam) {
                    throw new common_1.HttpException('Renavam is already registered.', common_1.HttpStatus.CONFLICT);
                }
            }
            const findMotorcycle = await this.prismaService.motorCycle.findFirst({
                where: {
                    id: id,
                },
            });
            if (!findMotorcycle)
                throw new common_1.HttpException('Motorcycle not found', common_1.HttpStatus.NOT_FOUND);
            let foto1 = findMotorcycle.foto1;
            if (body.foto1 !== undefined) {
                if (body.foto1 &&
                    body.foto1 !== '' &&
                    !body.foto1.startsWith('https://')) {
                    if (foto1) {
                        await this.s3Service.deleteImage(foto1);
                    }
                    foto1 = await this.s3Service.uploadBase64Image(body.foto1);
                }
                else if (body.foto1 === null || body.foto1 === '') {
                }
                else {
                    foto1 = body.foto1;
                }
            }
            let foto2 = findMotorcycle.foto2;
            if (body.foto2 !== undefined) {
                if (body.foto2 &&
                    body.foto2 !== '' &&
                    !body.foto2.startsWith('https://')) {
                    if (foto2) {
                        await this.s3Service.deleteImage(foto2);
                    }
                    foto2 = await this.s3Service.uploadBase64Image(body.foto2);
                }
                else if (body.foto2 === null || body.foto2 === '') {
                }
                else {
                    foto2 = body.foto2;
                }
            }
            let foto3 = findMotorcycle.foto3;
            if (body.foto3 !== undefined) {
                if (body.foto3 &&
                    body.foto3 !== '' &&
                    !body.foto3.startsWith('https://')) {
                    if (foto3) {
                        await this.s3Service.deleteImage(foto3);
                    }
                    foto3 = await this.s3Service.uploadBase64Image(body.foto3);
                }
                else if (body.foto3 === null || body.foto3 === '') {
                }
                else {
                    foto3 = body.foto3;
                }
            }
            const motorcycle = await this.prismaService.motorCycle.update({
                where: {
                    id: findMotorcycle.id,
                },
                data: {
                    ...body,
                    ano: body.ano ? new Date(body.ano) : undefined,
                    foto1: foto1,
                    foto2: foto2,
                    foto3: foto3,
                    updated_at: new Date(),
                },
                select: {
                    id: true,
                    nome: true,
                    cor: true,
                    placa: true,
                    ano: true,
                    chassi: true,
                    renavam: true,
                    km: true,
                    valor_compra: true,
                    valor_venda: true,
                    valor_fipe: true,
                    observacao: true,
                    status: true,
                    foto1: true,
                    foto2: true,
                    foto3: true,
                    created_at: true,
                    updated_at: true,
                },
            });
            return motorcycle;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Error updating motorcycle', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteOne(id) {
        try {
            const findMotorcycle = await this.prismaService.motorCycle.findFirst({
                where: {
                    id: id,
                },
            });
            if (!findMotorcycle)
                throw new common_1.HttpException('Motorcycle not found', common_1.HttpStatus.NOT_FOUND);
            const fotos = [
                findMotorcycle.foto1,
                findMotorcycle.foto2,
                findMotorcycle.foto3,
            ];
            await Promise.all(fotos.map((foto) => foto && foto !== ''
                ? this.s3Service.deleteImage(foto)
                : Promise.resolve()));
            await this.prismaService.motorCycle.delete({
                where: {
                    id: id,
                },
            });
            return { message: 'Motorcycle deleted successfully' };
        }
        catch (error) {
            throw new common_1.HttpException('Error deleting post', error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.MotorcycleService = MotorcycleService;
exports.MotorcycleService = MotorcycleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        aws_s3_service_1.AwsS3Service])
], MotorcycleService);
//# sourceMappingURL=motorcycle.service.js.map