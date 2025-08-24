"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateClientsDto = void 0;
const openapi = require("@nestjs/swagger");
const create_clients_dto_1 = require("./create-clients.dto");
const swagger_1 = require("@nestjs/swagger");
class UpdateClientsDto extends (0, swagger_1.PartialType)(create_clients_dto_1.CreateClientDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateClientsDto = UpdateClientsDto;
//# sourceMappingURL=update-clients.dto.js.map