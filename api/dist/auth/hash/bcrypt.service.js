"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptService = void 0;
const hashing_service_1 = require("./hashing.service");
const bcrypt = require("bcryptjs");
class BcryptService extends hashing_service_1.HashingProtocol {
    async hash(password) {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }
    compare(password, passwordHash) {
        return bcrypt.compare(password, passwordHash);
    }
}
exports.BcryptService = BcryptService;
//# sourceMappingURL=bcrypt.service.js.map