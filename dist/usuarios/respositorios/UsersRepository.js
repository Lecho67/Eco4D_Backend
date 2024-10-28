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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let UserRepository = class UserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        return this.prisma.usuario.findUnique({
            where: { cedula: id },
        });
    }
    async findByEmail(email) {
        return this.prisma.usuario.findFirst({
            where: { correo_electronico: email },
        });
    }
    async create(user) {
        return this.prisma.usuario.create({
            data: user,
        });
    }
    async update(id, user) {
        return this.prisma.usuario.update({
            where: { cedula: id },
            data: user,
        });
    }
    async delete(id) {
        await this.prisma.usuario.delete({
            where: { cedula: id },
        });
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserRepository);
//# sourceMappingURL=UsersRepository.js.map