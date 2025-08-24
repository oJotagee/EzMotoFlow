"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseContractsDto = exports.ResponseAllContractsDto = void 0;
const openapi = require("@nestjs/swagger");
class ResponseAllContractsDto {
    id;
    valor;
    data;
    observacao;
    pagamento;
    contractoPdf;
    status;
    motorcycle;
    client;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, valor: { required: true, type: () => Number }, data: { required: true, type: () => Date }, observacao: { required: true, type: () => String, nullable: true }, pagamento: { required: true, type: () => String }, contractoPdf: { required: true, type: () => String, nullable: true }, status: { required: true, type: () => String }, motorcycle: { required: true, type: () => ({ placa: { required: true, type: () => String }, renavam: { required: true, type: () => String }, id: { required: true, type: () => String }, nome: { required: true, type: () => String }, ano: { required: true, type: () => Date }, chassi: { required: true, type: () => String } }) }, client: { required: true, type: () => ({ id: { required: true, type: () => String }, fullName: { required: true, type: () => String }, documento: { required: true, type: () => String }, telefone: { required: true, type: () => String, nullable: true }, email: { required: true, type: () => String }, dataNascimento: { required: true, type: () => Date, nullable: true }, companyName: { required: true, type: () => String, nullable: true } }) } };
    }
}
exports.ResponseAllContractsDto = ResponseAllContractsDto;
class ResponseContractsDto {
    message;
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: true, type: () => String } };
    }
}
exports.ResponseContractsDto = ResponseContractsDto;
//# sourceMappingURL=response.dto.js.map