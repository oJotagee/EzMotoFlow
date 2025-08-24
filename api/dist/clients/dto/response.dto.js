"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseClientsDto = exports.ResponseClientDto = exports.ResponseAllClientsDto = void 0;
const openapi = require("@nestjs/swagger");
class ResponseAllClientsDto {
    id;
    tipo;
    fullName;
    documento;
    telefone;
    email;
    dataNascimento;
    companyName;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tipo: { required: true, type: () => String }, fullName: { required: true, type: () => String }, documento: { required: true, type: () => String }, telefone: { required: true, type: () => String, nullable: true }, email: { required: true, type: () => String }, dataNascimento: { required: true, type: () => Date, nullable: true }, companyName: { required: true, type: () => String, nullable: true }, status: { required: true, type: () => String } };
    }
}
exports.ResponseAllClientsDto = ResponseAllClientsDto;
class ResponseClientDto {
    id;
    tipo;
    fullName;
    documento;
    telefone;
    email;
    dataNascimento;
    companyName;
    status;
    cep;
    rua;
    numero;
    bairro;
    cidade;
    estado;
    complementos;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tipo: { required: true, type: () => String }, fullName: { required: true, type: () => String }, documento: { required: true, type: () => String }, telefone: { required: true, type: () => String, nullable: true }, email: { required: true, type: () => String }, dataNascimento: { required: true, type: () => Date, nullable: true }, companyName: { required: true, type: () => String, nullable: true }, status: { required: true, type: () => String }, cep: { required: true, type: () => String }, rua: { required: true, type: () => String }, numero: { required: true, type: () => String }, bairro: { required: true, type: () => String }, cidade: { required: true, type: () => String }, estado: { required: true, type: () => String }, complementos: { required: true, type: () => String, nullable: true } };
    }
}
exports.ResponseClientDto = ResponseClientDto;
class ResponseClientsDto {
    message;
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: true, type: () => String } };
    }
}
exports.ResponseClientsDto = ResponseClientsDto;
//# sourceMappingURL=response.dto.js.map