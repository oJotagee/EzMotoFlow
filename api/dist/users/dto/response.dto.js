"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedUsersResponseDto = exports.ResponseDeleteUserDto = exports.ResponseUpdateUserDto = exports.ResponseCreateUserDto = exports.ResponseFindUserDto = void 0;
const openapi = require("@nestjs/swagger");
class ResponseFindUserDto {
    id;
    name;
    email;
    created_at;
    updated_at;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, created_at: { required: true, type: () => Date, nullable: true }, updated_at: { required: true, type: () => Date, nullable: true } };
    }
}
exports.ResponseFindUserDto = ResponseFindUserDto;
class ResponseCreateUserDto {
    id;
    name;
    email;
    created_at;
    updated_at;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, created_at: { required: true, type: () => Date, nullable: true }, updated_at: { required: true, type: () => Date, nullable: true } };
    }
}
exports.ResponseCreateUserDto = ResponseCreateUserDto;
class ResponseUpdateUserDto {
    id;
    name;
    email;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String } };
    }
}
exports.ResponseUpdateUserDto = ResponseUpdateUserDto;
class ResponseDeleteUserDto {
    message;
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: true, type: () => String } };
    }
}
exports.ResponseDeleteUserDto = ResponseDeleteUserDto;
class PaginatedUsersResponseDto {
    data;
    total;
    page;
    limit;
    pages;
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("./response.dto").ResponseFindUserDto] }, total: { required: true, type: () => Number }, page: { required: true, type: () => Number }, limit: { required: true, type: () => Number }, pages: { required: true, type: () => Number } };
    }
}
exports.PaginatedUsersResponseDto = PaginatedUsersResponseDto;
//# sourceMappingURL=response.dto.js.map