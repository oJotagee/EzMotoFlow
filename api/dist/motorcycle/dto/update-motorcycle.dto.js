"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMotorcycleDto = void 0;
const openapi = require("@nestjs/swagger");
const create_motorcycle_dto_1 = require("./create-motorcycle.dto");
const swagger_1 = require("@nestjs/swagger");
class UpdateMotorcycleDto extends (0, swagger_1.PartialType)(create_motorcycle_dto_1.CreateMotorCycleDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateMotorcycleDto = UpdateMotorcycleDto;
//# sourceMappingURL=update-motorcycle.dto.js.map