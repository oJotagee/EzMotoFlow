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
exports.FilterDto = void 0;
const openapi = require("@nestjs/swagger");
const pagination_dto_1 = require("../../commom/dto/pagination.dto");
const class_validator_1 = require("class-validator");
class FilterDto extends pagination_dto_1.PaginationDto {
    status;
    tipo;
    nome;
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: false, type: () => Object, enum: ['ativo', 'inativo'] }, tipo: { required: false, type: () => Object, enum: ['PESSOA_FISICA', 'PESSOA_JURIDICA'] }, nome: { required: false, type: () => String } };
    }
}
exports.FilterDto = FilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['ativo', 'inativo']),
    __metadata("design:type", String)
], FilterDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['PESSOA_FISICA', 'PESSOA_JURIDICA']),
    __metadata("design:type", String)
], FilterDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterDto.prototype, "nome", void 0);
//# sourceMappingURL=filter.dto.js.map