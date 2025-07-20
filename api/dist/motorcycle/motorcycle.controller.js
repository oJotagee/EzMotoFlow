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
const common_1 = require("@nestjs/common");
const motorcycle_service_1 = require("./motorcycle.service");
const swagger_1 = require("@nestjs/swagger");
const auth_token_guard_1 = require("../auth/guard/auth-token.guard");
const pagination_dto_1 = require("../commom/dto/pagination.dto");
let MotorcycleController = class MotorcycleController {
    motorcycleService;
    constructor(motorcycleService) {
        this.motorcycleService = motorcycleService;
    }
    fintAllMotorcycle(Pagination) {
        return this.motorcycleService.getAll(Pagination);
    }
};
exports.MotorcycleController = MotorcycleController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_token_guard_1.AuthTokenGuard),
    (0, swagger_1.ApiOperation)({ summary: "Get all motorcycles" }),
    (0, swagger_1.ApiQuery)({
        name: "limit",
        required: false,
        example: 10,
        description: "Limit of motorcycle to fetch"
    }),
    (0, swagger_1.ApiQuery)({
        name: "offset",
        required: false,
        example: 0,
        description: "Number of motorcycle to skip"
    }),
    openapi.ApiResponse({ status: 200, type: [require("./dto/response.dto").ResponseAllMotorcycleDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], MotorcycleController.prototype, "fintAllMotorcycle", null);
exports.MotorcycleController = MotorcycleController = __decorate([
    (0, common_1.Controller)('motorcycle'),
    __metadata("design:paramtypes", [motorcycle_service_1.MotorcycleService])
], MotorcycleController);
//# sourceMappingURL=motorcycle.controller.js.map