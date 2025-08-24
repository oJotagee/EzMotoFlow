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
exports.ClientsController = void 0;
const openapi = require("@nestjs/swagger");
const auth_token_guard_1 = require("../auth/guard/auth-token.guard");
const update_clients_dto_1 = require("./dto/update-clients.dto");
const create_clients_dto_1 = require("./dto/create-clients.dto");
const clients_service_1 = require("./clients.service");
const filter_dto_1 = require("./dto/filter.dto");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
let ClientsController = class ClientsController {
    clientsService;
    constructor(clientsService) {
        this.clientsService = clientsService;
    }
    fintAllMotorcycle(Filter) {
        return this.clientsService.getAll(Filter);
    }
    findMotorcycleById(id) {
        return this.clientsService.getOne(id);
    }
    CreateMotorcycle(body) {
        return this.clientsService.createOne(body);
    }
    UpdatePost(id, body) {
        return this.clientsService.updateOne(id, body);
    }
    DeletePost(id) {
        return this.clientsService.deleteOne(id);
    }
};
exports.ClientsController = ClientsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get all clients' }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        example: 10,
        description: 'Limit of clients to fetch',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'offset',
        required: false,
        example: 0,
        description: 'Number of clients to skip',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        example: '',
        description: 'Filter by clients status: "active" or "inactive"',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'nome',
        required: false,
        example: '',
        description: 'Filter by clients name',
    }),
    openapi.ApiResponse({ status: 200, type: [require("./dto/response.dto").ResponseAllClientsDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_dto_1.FilterDto]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "fintAllMotorcycle", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Find a clients' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        example: 'dtpysooc8k9p2mk6f09rv5ro',
        description: 'Clients identifier',
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/response.dto").ResponseClientDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "findMotorcycleById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    openapi.ApiResponse({ status: 201, type: require("./dto/response.dto").ResponseAllClientsDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_clients_dto_1.CreateClientDto]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "CreateMotorcycle", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update a client' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        example: 'dtpysooc8k9p2mk6f09rv5ro',
        description: 'Client identifier',
    }),
    openapi.ApiResponse({ status: 200, type: require("./dto/response.dto").ResponseAllClientsDto }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_clients_dto_1.UpdateClientsDto]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "UpdatePost", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, swagger_1.ApiParam)({
        name: 'id',
        example: 'dtpysooc8k9p2mk6f09rv5ro',
        description: 'Client identifier',
    }),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a client' }),
    openapi.ApiResponse({ status: 200, type: require("./dto/response.dto").ResponseClientsDto }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientsController.prototype, "DeletePost", null);
exports.ClientsController = ClientsController = __decorate([
    (0, common_1.Controller)('clients'),
    __metadata("design:paramtypes", [clients_service_1.ClientsService])
], ClientsController);
//# sourceMappingURL=clients.controller.js.map