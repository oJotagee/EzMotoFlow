"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayloadDto = void 0;
const openapi = require("@nestjs/swagger");
class PayloadDto {
    sub;
    email;
    iat;
    exp;
    aud;
    iss;
    static _OPENAPI_METADATA_FACTORY() {
        return { sub: { required: true, type: () => String }, email: { required: true, type: () => String }, iat: { required: true, type: () => Number }, exp: { required: true, type: () => Number }, aud: { required: true, type: () => String }, iss: { required: true, type: () => String } };
    }
}
exports.PayloadDto = PayloadDto;
//# sourceMappingURL=payload.dto.js.map