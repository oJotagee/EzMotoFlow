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
            throw new common_1.HttpException("Failed to update user", error instanceof common_1.HttpException ? error.getStatus() : common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.MotorcycleService = MotorcycleService;
exports.MotorcycleService = MotorcycleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MotorcycleService);
//# sourceMappingURL=motorcycle.service.js.map