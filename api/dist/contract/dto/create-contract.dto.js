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
exports.CreateContractDto = exports.Pagamento = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var Pagamento;
(function (Pagamento) {
    Pagamento["boleto"] = "boleto";
    Pagamento["cartao"] = "cartao";
    Pagamento["pix"] = "pix";
})(Pagamento || (exports.Pagamento = Pagamento = {}));
class CreateContractDto {
    observacao;
    pagamento;
    contractoPdf;
    motorcycleId;
    clientId;
    static _OPENAPI_METADATA_FACTORY() {
        return { observacao: { required: false, type: () => String }, pagamento: { required: true, enum: require("./create-contract.dto").Pagamento }, contractoPdf: { required: true, type: () => String }, motorcycleId: { required: true, type: () => String }, clientId: { required: true, type: () => String } };
    }
}
exports.CreateContractDto = CreateContractDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "observacao", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(Pagamento),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "pagamento", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "contractoPdf", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "motorcycleId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateContractDto.prototype, "clientId", void 0);
//# sourceMappingURL=create-contract.dto.js.map