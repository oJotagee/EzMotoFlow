"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseMotorcycleDto = exports.ResponseAllMotorcycleDto = void 0;
const openapi = require("@nestjs/swagger");
class ResponseAllMotorcycleDto {
    id;
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
    created_at;
    updated_at;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, cor: { required: true, type: () => String }, placa: { required: true, type: () => String }, ano: { required: true, type: () => Date }, chassi: { required: true, type: () => String }, renavam: { required: true, type: () => String }, km: { required: true, type: () => String }, valor_compra: { required: true, type: () => Number }, valor_venda: { required: true, type: () => Number }, valor_fipe: { required: true, type: () => Number }, observacao: { required: true, type: () => String, nullable: true }, created_at: { required: true, type: () => Date, nullable: true }, updated_at: { required: true, type: () => Date, nullable: true } };
    }
}
exports.ResponseAllMotorcycleDto = ResponseAllMotorcycleDto;
class ResponseMotorcycleDto {
    message;
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: true, type: () => String } };
    }
}
exports.ResponseMotorcycleDto = ResponseMotorcycleDto;
//# sourceMappingURL=response.dto.js.map