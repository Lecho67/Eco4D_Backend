"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSolicitudDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateSolicitudDto {
}
exports.CreateSolicitudDto = CreateSolicitudDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Error en el sistema', description: 'Título de la solicitud' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSolicitudDto.prototype, "titulo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'fallas tecnicas',
        description: 'Tipo de solicitud',
        enum: ['fallas tecnicas', 'inconsistencia de datos', 'configuraciones', 'otros'],
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['fallas tecnicas', 'inconsistencia de datos', 'configuraciones', 'otros']),
    __metadata("design:type", String)
], CreateSolicitudDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'La aplicación se cierra al intentar guardar un documento',
        description: 'Descripción detallada del problema o solicitud',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSolicitudDto.prototype, "descripcion", void 0);
//# sourceMappingURL=create-solicitud.dto.js.map