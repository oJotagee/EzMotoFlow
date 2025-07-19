"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenPayload = void 0;
const common_1 = require("@nestjs/common");
const auth_constant_1 = require("../commom/auth.constant");
exports.TokenPayload = (0, common_1.createParamDecorator)((data, context) => {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    return request[auth_constant_1.TOKEN_PAYLOAD];
});
//# sourceMappingURL=token-payload.param.js.map