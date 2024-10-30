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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoporteController = void 0;
const common_1 = require("@nestjs/common");
const soporte_service_1 = require("./soporte.service");
const create_solicitud_dto_1 = require("./dto/create-solicitud.dto");
const auth_guard_1 = require("../auth/auth.guard");
const roles_guard_1 = require("../usuarios/roles/roles.guard");
const roles_decorator_1 = require("../usuarios/roles/roles.decorator");
const roles_enum_1 = require("../usuarios/roles/roles.enum");
let SoporteController = class SoporteController {
    constructor(solicitudService) {
        this.solicitudService = solicitudService;
    }
    async createSolicitud(createSolicitudDto, req) {
        return this.solicitudService.createSolicitud(createSolicitudDto, req.user.cedula);
    }
    async getMisSolicitudes(req) {
        return this.solicitudService.getSolicitudesByPaciente(req.user.cedula);
    }
    async getOpenSolicitudes() {
        return this.solicitudService.getOpenSolicitudes();
    }
};
exports.SoporteController = SoporteController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Paciente),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_solicitud_dto_1.CreateSolicitudDto, Object]),
    __metadata("design:returntype", Promise)
], SoporteController.prototype, "createSolicitud", null);
__decorate([
    (0, common_1.Get)('mis-solicitudes'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Paciente),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SoporteController.prototype, "getMisSolicitudes", null);
__decorate([
    (0, common_1.Get)('solicitudes-abiertas'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Administrador),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SoporteController.prototype, "getOpenSolicitudes", null);
exports.SoporteController = SoporteController = __decorate([
    (0, common_1.Controller)('soporte'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [soporte_service_1.SoporteService])
], SoporteController);
//# sourceMappingURL=soporte.controller.js.map