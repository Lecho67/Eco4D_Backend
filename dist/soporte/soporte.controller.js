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
const swagger_1 = require("@nestjs/swagger");
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
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva solicitud de soporte' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Solicitud creada con éxito',
        schema: {
            example: {
                id: "39f270d7-da7b-4025-89de-1037a29915a6",
                titulo: "Problema con el sistema",
                fechaReporte: "2024-10-30T18:04:32.265Z",
                fechaSolucion: null,
                tipo: "fallas tecnicas",
                descripcion: "No puedo acceder a mis diagnósticos",
                estado: "A",
                solicitanteId: 12345678,
                encargadoId: null,
                solicitante: {
                    nombre_completo: "John Doe",
                    correo_electronico: "johndoe@example.com"
                }
            }
        }
    }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_solicitud_dto_1.CreateSolicitudDto, Object]),
    __metadata("design:returntype", Promise)
], SoporteController.prototype, "createSolicitud", null);
__decorate([
    (0, common_1.Get)('mis-solicitudes'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Paciente),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener solicitudes de soporte del paciente actual' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de solicitudes del paciente',
        schema: {
            example: [
                {
                    id: "39f270d7-da7b-4025-89de-1037a29915a6",
                    titulo: "Problema con el sistema",
                    fechaReporte: "2024-10-30T18:04:32.265Z",
                    fechaSolucion: null,
                    tipo: "fallas tecnicas",
                    descripcion: "No puedo acceder a mis diagnósticos",
                    estado: "A",
                    solicitanteId: 12345678,
                    encargadoId: null,
                    solicitante: {
                        nombre_completo: "John Doe"
                    },
                    encargado: null
                }
            ]
        }
    }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SoporteController.prototype, "getMisSolicitudes", null);
__decorate([
    (0, common_1.Get)('solicitudes-abiertas'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Administrador),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las solicitudes abiertas' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de solicitudes abiertas',
        schema: {
            example: [
                {
                    id: 2,
                    titulo: 'Inconsistencia de datos',
                    tipo: 'inconsistencia de datos',
                    descripcion: 'Datos erróneos en el perfil del usuario',
                    fechaReporte: '2024-10-30T10:00:00Z',
                    solicitante: { nombre_completo: 'Maria López', correo_electronico: 'maria.lopez@example.com' },
                    estado: 'A',
                }
            ]
        }
    }),
    (0, swagger_1.ApiBearerAuth)(),
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