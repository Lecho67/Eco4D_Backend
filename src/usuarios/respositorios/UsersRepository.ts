import { Injectable, ConflictException,InternalServerErrorException, BadRequestException} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
import { Usuario } from '../interfaces/Usuario';
import { CreateUserDto } from '../dto/createuser.dto';
import { AzureBlobService } from 'src/azure-blob-service/AzureBlob.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService, private azureBlobService: AzureBlobService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.usuario.create({
        data: {
          identificacion: createUserDto.identificacion,
          tipoIdentificacion: createUserDto.tipoIdentificacion,
          nombre_completo: createUserDto.nombre_completo,
          correo_electronico: createUserDto.correo_electronico,
          contrasena: createUserDto.contrasena,
          rol: createUserDto.rol || 'P',
          pais: createUserDto.pais,
          ciudad: createUserDto.ciudad,
          fecha_nacimiento: createUserDto.fecha_nacimiento,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // El código P2002 indica una violación de restricción única
        if (error.code === 'P2002') {
          const field = error.meta?.target as string[];
          if (field?.includes('correo_electronico')) {
            throw new ConflictException({
              statusCode: 409,
              message: 'El correo electrónico ya está registrado',
              error: 'Conflict',
              details: {
                field: 'correo_electronico',
                value: createUserDto.correo_electronico
              }
              
            }
            
          );
          }
        else if(field?.includes('identificacion')){
          throw new ConflictException({
            statusCode: 409,
            message: 'La identificación ya está registrada',
            error: 'Conflict',
            details: {
              field: 'identificacion',
              value: createUserDto.identificacion
            }
          });
        }
        }
      }
      
      // Si es otro tipo de error, lanzamos un error interno del servidor
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Error interno del servidor al crear el usuario',
        error: 'Internal Server Error'
      });
    }
  }


  async findById(id: number) {
    return this.prisma.usuario.findUnique({
      where: { identificacion: id }
    });
  }

  async findByIdWhithoutPassword(id: number) {
    return this.prisma.usuario.findUnique({
      where: { identificacion: id },
      select: {
        identificacion: true,
        tipoIdentificacion: true,
        nombre_completo: true,
        correo_electronico: true,
        rol: true,
        pais: true,
        ciudad: true,
        fecha_nacimiento: true,
        url_foto_de_perfil:true 
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { correo_electronico: email },
    });
  }

  async update(id: number, data: Partial<Usuario>) {
    return this.prisma.usuario.update({
      where: { identificacion: id },
      data,
    });
  }

  async delete(id: number) {
    await this.prisma.usuario.delete({
      where: { identificacion: id },
    });
  }

  async getMedicos() {
    const medicos = await this.prisma.usuario.findMany({
      where: {
        rol: 'M', // Filtrar por rol de Médico
      },
      select: {
        identificacion: true,
        tipoIdentificacion: true,
        nombre_completo: true,
        correo_electronico: true,
        rol: true,
        pais: true,
        ciudad: true,
        fecha_nacimiento: true,
      },
    });
  
    return medicos;
  }

  async getPacientes(){
    let paciente = this.prisma.usuario.findMany({
      where: {
        rol: 'P'
      },
      select: {
        identificacion: true,
        tipoIdentificacion: true,
        nombre_completo: true,
        correo_electronico: true,
        rol: true,
        pais: true,
        ciudad: true,
        fecha_nacimiento: true,
      },
    })

    return paciente
  }

  async getAdministradores(){
    let administradores = this.prisma.usuario.findMany({
      where:{
        rol: 'A'
      },
      select: {
        identificacion: true,
        tipoIdentificacion: true,
        nombre_completo: true,
        correo_electronico: true,
        rol: true,
        pais: true,
        ciudad: true,
        fecha_nacimiento: true,
      },
    })
    return administradores
  }


  async añadirFoto(id: number, file: Express.Multer.File) {
      const url = await this.azureBlobService.uploadImage(file);
      await this.prisma.usuario.update({
        where: { identificacion: id },
        data: {
          url_foto_de_perfil: url,
        },
      });

    return url
  }
}
