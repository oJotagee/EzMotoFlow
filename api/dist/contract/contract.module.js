"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractModule = void 0;
const contract_controller_1 = require("./contract.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const contract_service_1 = require("./contract.service");
const auth_module_1 = require("../auth/auth.module");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
let ContractModule = class ContractModule {
};
exports.ContractModule = ContractModule;
exports.ContractModule = ContractModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, auth_module_1.AuthModule, axios_1.HttpModule],
        controllers: [contract_controller_1.ContractController],
        providers: [contract_service_1.ContractService],
    })
], ContractModule);
//# sourceMappingURL=contract.module.js.map