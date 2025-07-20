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
let MotorcycleService = class MotorcycleService {
    prismaService;
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getAll(pagination) {
        try {
            const { limit = 6, offset = 0 } = pagination;
            const motorcycles = await this.prismaService.motorCycle.findMany({
                select: {
                    id: true,
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
            const newMotorcycle = await this.prismaService.motorCycle.create({
                data: {
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
                },
                select: {
                    id: true,
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
            const findMotorcycle = await this.prismaService.motorCycle.findFirst({
                where: {
                    id: id,
                },
            });
            if (!findMotorcycle)
                throw new common_1.HttpException('Motorcycle not found', common_1.HttpStatus.NOT_FOUND);
            const motorcycle = await this.prismaService.motorCycle.update({
                where: {
                    id: findMotorcycle.id,
                },
                data: {
                    ...body,
                    updated_at: new Date(),
                },
                select: {
                    id: true,
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
            });
            return motorcycle;
        }
        catch (error) {
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MotorcycleService);
//# sourceMappingURL=motorcycle.service.js.map