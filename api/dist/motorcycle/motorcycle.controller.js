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
exports.MotorcycleController = void 0;
const openapi = require("@nestjs/swagger");
const create_motorcycle_dto_1 = require("./dto/create-motorcycle.dto");
const update_motorcycle_dto_1 = require("./dto/update-motorcycle.dto");
const auth_token_guard_1 = require("../auth/guard/auth-token.guard");
const motorcycle_service_1 = require("./motorcycle.service");
const filter_dto_1 = require("./dto/filter.dto");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let MotorcycleController = class MotorcycleController {
    motorcycleService;
    constructor(motorcycleService) {
        this.motorcycleService = motorcycleService;
    }
    findAllMotorcycles(filter) {
        return this.motorcycleService.getAll(filter);
    }
    findMotorcycleById(id) {
        return this.motorcycleService.getOne(id);
    }
    createMotorcycle(body) {
        return this.motorcycleService.createOne(body);
    }
    updateMotorcycle(id, body) {
        return this.motorcycleService.updateOne(id, body);
    }
    deleteMotorcycle(id) {
        return this.motorcycleService.deleteOne(id);
    }
};
exports.MotorcycleController = MotorcycleController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get all motorcycles with pagination' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        example: 10,
        description: 'Limit of motorcycles to fetch (max 10)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        required: false,
        example: 0,
        description: 'Number of motorcycles to skip',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        example: '',
        description: 'Filter by motorcycle status: "ativo", "inativo" or "vendido"',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'placa',
        required: false,
        example: '',
        description: 'Filter motorcycle by license plate (exact or partial search)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'nome',
        required: false,
        example: '',
        description: 'Filter by motorcycle name',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'anoMin',
        required: false,
        example: 2017,
        description: 'Filter by minimum year (inclusive)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'anoMax',
        required: false,
        example: 2025,
        description: 'Filter by maximum year (inclusive)',
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/response.dto").PaginatedMotorcyclesResponseDto }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_dto_1.FilterDto]),
    __metadata("design:returntype", void 0)
], MotorcycleController.prototype, "findAllMotorcycles", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Find a motorcycle by ID' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        example: 'dtpysooc8k9p2mk6f09rv5ro',
        description: 'Motorcycle identifier',
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/response.dto").ResponseAllMotorcycleDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MotorcycleController.prototype, "findMotorcycleById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new motorcycle' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/response.dto").ResponseAllMotorcycleDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_motorcycle_dto_1.CreateMotorCycleDto]),
    __metadata("design:returntype", void 0)
], MotorcycleController.prototype, "createMotorcycle", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update a motorcycle' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        example: 'dtpysooc8k9p2mk6f09rv5ro',
        description: 'Motorcycle identifier',
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/response.dto").ResponseAllMotorcycleDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_motorcycle_dto_1.UpdateMotorcycleDto]),
    __metadata("design:returntype", void 0)
], MotorcycleController.prototype, "updateMotorcycle", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, swagger_1.ApiParam)({
        name: 'id',
        example: 'dtpysooc8k9p2mk6f09rv5ro',
        description: 'Motorcycle identifier',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a motorcycle' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/response.dto").ResponseMotorcycleDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MotorcycleController.prototype, "deleteMotorcycle", null);
exports.MotorcycleController = MotorcycleController = __decorate([
    (0, common_1.Controller)('motorcycle'),
    __metadata("design:paramtypes", [motorcycle_service_1.MotorcycleService])
], MotorcycleController);
//# sourceMappingURL=motorcycle.controller.js.map