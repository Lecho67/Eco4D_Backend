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
exports.SoporteService = void 0;
const common_1 = require("@nestjs/common");
const solicitud_respository_1 = require("./respository/solicitud.respository");
let SoporteService = class SoporteService {
    constructor(solicitudRepository) {
        this.solicitudRepository = solicitudRepository;
    }
    async createSolicitud(createSolicitudDto, solicitanteId) {
        return this.solicitudRepository.create(createSolicitudDto, solicitanteId);
    }
    async getSolicitudesByPaciente(pacienteId) {
        return this.solicitudRepository.findAllByPaciente(pacienteId);
    }
    async getOpenSolicitudes() {
        return this.solicitudRepository.findAllOpenSolicitudes();
    }
};
exports.SoporteService = SoporteService;
exports.SoporteService = SoporteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [solicitud_respository_1.SolicitudRepository])
], SoporteService);
//# sourceMappingURL=soporte.service.js.map