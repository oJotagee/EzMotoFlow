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
exports.CreateMotorCycleDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateMotorCycleDto {
    cor;
    placa;
    ano;
    chassi;
    renavam;
    km;
    valor_compra;
    valor_venda;
    valor_fipe;
    observacao;
    static _OPENAPI_METADATA_FACTORY() {
        return { cor: { required: true, type: () => String }, placa: { required: true, type: () => String, maximum: 7 }, ano: { required: true, type: () => Date }, chassi: { required: true, type: () => String, maximum: 17 }, renavam: { required: true, type: () => String, maximum: 11 }, km: { required: true, type: () => String }, valor_compra: { required: true, type: () => Number }, valor_venda: { required: true, type: () => Number }, valor_fipe: { required: true, type: () => Number }, observacao: { required: true, type: () => String } };
    }
}
exports.CreateMotorCycleDto = CreateMotorCycleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMotorCycleDto.prototype, "cor", void 0);
__decorate([
    (0, class_validator_1.Max)(7),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMotorCycleDto.prototype, "placa", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreateMotorCycleDto.prototype, "ano", void 0);
__decorate([
    (0, class_validator_1.Max)(17),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMotorCycleDto.prototype, "chassi", void 0);
__decorate([
    (0, class_validator_1.Max)(11),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMotorCycleDto.prototype, "renavam", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMotorCycleDto.prototype, "km", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateMotorCycleDto.prototype, "valor_compra", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateMotorCycleDto.prototype, "valor_venda", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateMotorCycleDto.prototype, "valor_fipe", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEmpty)(),
    __metadata("design:type", String)
], CreateMotorCycleDto.prototype, "observacao", void 0);
//# sourceMappingURL=create-motorcycle.dto.js.map