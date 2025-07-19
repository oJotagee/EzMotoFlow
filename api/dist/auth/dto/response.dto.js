"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseAuthDto = void 0;
const openapi = require("@nestjs/swagger");
class ResponseAuthDto {
    id;
    name;
    email;
    token;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, token: { required: true, type: () => String } };
    }
}
exports.ResponseAuthDto = ResponseAuthDto;
//# sourceMappingURL=response.dto.js.map