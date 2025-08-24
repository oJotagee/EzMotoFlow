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
exports.ContractController = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const auth_token_guard_1 = require("../auth/guard/auth-token.guard");
const create_contract_dto_1 = require("./dto/create-contract.dto");
const contract_service_1 = require("./contract.service");
const filter_dto_1 = require("./dto/filter.dto");
const common_1 = require("@nestjs/common");
let ContractController = class ContractController {
    contractsService;
    constructor(contractsService) {
        this.contractsService = contractsService;
    }
    fintAllMotorcycle(Filter) {
        return this.contractsService.getAll(Filter);
    }
    findMotorcycleById(id) {
        return this.contractsService.getOne(id);
    }
    CreateContract(body) {
        return this.contractsService.createOne(body);
    }
    DeleteContract(id) {
        return this.contractsService.deleteOne(id);
    }
};
exports.ContractController = ContractController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get all contracts' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        example: 10,
        description: 'Limit of contracts to fetch',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        required: false,
        example: 0,
        description: 'Number of contracts to skip',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        example: '',
        description: 'Filter by contacts status: "active", "canceled" or "finalized"',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'nomeCliente',
        required: false,
        example: '',
        description: 'Filter by client name',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'documentoCliente',
        required: false,
        example: '',
        description: 'Filter by client document',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'placa',
        required: false,
        example: '',
        description: 'Filter by plate',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'renavam',
        required: false,
        example: '',
        description: 'Filter by renavam',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dataInicio',
        required: false,
        example: 2017,
        description: 'Filtrar por ano da motocicleta (exato)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'dataFim',
        required: false,
        example: 2025,
        description: 'Filtrar por ano da motocicleta (exato)',
    }),
    openapi.ApiResponse({ status: 200, type: [require("./dto/response.dto").ResponseAllContractsDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_dto_1.FilterDto]),
    __metadata("design:returntype", void 0)
], ContractController.prototype, "fintAllMotorcycle", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Find a contract' }),
    (0, swagger_1.ApiQuery)({
        name: 'id',
        example: 'dtpysooc8k9p2mk6f09rv5ro',
        description: 'Contract identifier',
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/response.dto").ResponseAllContractsDto }),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContractController.prototype, "findMotorcycleById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create a contract' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/response.dto").ResponseAllContractsDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contract_dto_1.CreateContractDto]),
    __metadata("design:returntype", void 0)
], ContractController.prototype, "CreateContract", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a contract' }),
    (0, swagger_1.ApiQuery)({
        name: 'id',
        example: 'dtpysooc8k9p2mk6f09rv5ro',
        description: 'Contract identifier',
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/response.dto").ResponseContractsDto }),
    __param(0, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContractController.prototype, "DeleteContract", null);
exports.ContractController = ContractController = __decorate([
    (0, common_1.Controller)('contract'),
    __metadata("design:paramtypes", [contract_service_1.ContractService])
], ContractController);
//# sourceMappingURL=contract.controller.js.map