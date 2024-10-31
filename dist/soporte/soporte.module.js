"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoporteModule = void 0;
const common_1 = require("@nestjs/common");
const soporte_controller_1 = require("./soporte.controller");
const soporte_service_1 = require("./soporte.service");
const solicitud_respository_1 = require("./respository/solicitud.respository");
const prisma_service_1 = require("../prisma.service");
const auth_module_1 = require("../auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
let SoporteModule = class SoporteModule {
};
exports.SoporteModule = SoporteModule;
exports.SoporteModule = SoporteModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [soporte_controller_1.SoporteController],
        providers: [soporte_service_1.SoporteService, solicitud_respository_1.SolicitudRepository, prisma_service_1.PrismaService, jwt_1.JwtService]
    })
], SoporteModule);
//# sourceMappingURL=soporte.module.js.map