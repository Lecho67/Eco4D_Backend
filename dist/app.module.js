"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const diagnosticos_module_1 = require("./diagnosticos/diagnosticos.module");
const soporte_module_1 = require("./soporte/soporte.module");
const mensajes_module_1 = require("./mensajes/mensajes.module");
const prisma_service_1 = require("./prisma.service");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [usuarios_module_1.UsuariosModule, diagnosticos_module_1.DiagnosticosModule, soporte_module_1.SoporteModule, mensajes_module_1.MensajesModule, auth_module_1.AuthModule],
        controllers: [],
        providers: [prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map