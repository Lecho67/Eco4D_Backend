import { 
    Controller, 
    Post, 
    Body, 
    UploadedFiles,
    UseInterceptors,
    UseGuards,
    Request,
    BadRequestException,
    Get,
    Param, 
    ParseIntPipe,
    ForbiddenException,
    Put,
    Req
  } from '@nestjs/common';
  import { FileFieldsInterceptor } from '@nestjs/platform-express';
  import { DiagnosticoService } from './diagnostico.service';
  import { CreateDiagnosticoDto } from './dto/create-diagnosticos.dto';
  import { AuthGuard } from 'src/auth/auth.guard';
  import { RolesGuard } from 'src/usuarios/roles/roles.guard';
  import { Roles } from 'src/usuarios/roles/roles.decorator';
  import { Role } from 'src/usuarios/roles/roles.enum';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
  @Controller('diagnosticos')
  @ApiCookieAuth('jwt')
  @UseGuards(AuthGuard, RolesGuard)
  export class DiagnosticoController {
    constructor(private readonly diagnosticoService: DiagnosticoService) {}
  
    @Post()
    @Roles(Role.Medico)
    @UseInterceptors(
      FileFieldsInterceptor(
        [
          { name: 'video', maxCount: 1 },
          { name: 'imagen', maxCount: 1 }
        ],
        {
          fileFilter: (req, file, callback) => {
            if (file.fieldname === 'video' && !file.mimetype.includes('video/')) {
              return callback(
                new BadRequestException('Solo se permiten archivos de video'),
                false
              );
            }
            if (file.fieldname === 'imagen' && !file.mimetype.includes('image/')) {
              return callback(
                new BadRequestException('Solo se permiten archivos de imagen'),
                false
              );
            }
            callback(null, true);
          },
          limits: {
            fileSize: 100 * 1024 * 1024, // 100MB máximo
          },
        }
      )
    )

    @ApiOperation({ summary: 'Crear nuevo diagnóstico' })
    @ApiConsumes('multipart/form-data')

    @ApiResponse({
      status: 201,
      description: 'Diagnóstico creado exitosamente',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          descripcion: { type: 'string' },
          edadGestacional: { type: 'string' },
          enlaceFoto: { type: 'string' },
          enlaceVideo: { type: 'string' },
          shareLink: { type: 'string' },
          calificacion: { type: 'number' },
          medicoId: { type: 'number' },
          pacienteId: { type: 'number' },
          fecha: { type: 'string', format: 'date-time' },
          medico: {
            type: 'object',
            properties: {
              nombre_completo: { type: 'string' },
              correo_electronico: { type: 'string' }
            }
          },
          paciente: {
            type: 'object',
            properties: {
              nombre_completo: { type: 'string' },
              correo_electronico: { type: 'string' }
            }
          },
          message: { type: 'string' }
        }
      }
    })
    @ApiResponse({ status: 400, description: 'Datos inválidos o archivos faltantes' })
    @ApiResponse({ status: 403, description: 'Usuario no autorizado' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    async create(
      @Request() req,
      @Body() createDiagnosticoDto: CreateDiagnosticoDto,
      @UploadedFiles() files: { video?: Express.Multer.File[], imagen?: Express.Multer.File[] }
    ) {
      if (!files.video?.[0] || !files.imagen?.[0]) {
        throw new BadRequestException('Se requiere tanto el video como la imagen');
      }
  
      return this.diagnosticoService.create(
        createDiagnosticoDto,
        files.video[0],
        files.imagen[0],
        req.user.identificacion
      );
    }
  @UseGuards(AuthGuard) 

  @ApiOperation({ summary: 'Obtener URLs seguras de diagnóstico' })// Documenta que se requiere autenticación
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID del diagnóstico para el que se quieren obtener URLs seguras',
    example: '1'
  })
  @ApiResponse({
    status: 200,
    description: 'URLs seguras generadas exitosamente',
    schema: {
      type: 'object',
      properties: {
        imageUrl: { type: 'string', description: 'URL segura de la imagen' },
        videoUrl: { type: 'string', description: 'URL segura del video' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Diagnóstico no encontrado' })
  @ApiResponse({ status: 403, description: 'No tiene acceso a este recurso' })
  @Get('/secure-urls/:id')
  async getSecureUrls(@Param('id') id: string, @Request() req) {
    return this.diagnosticoService.getSecureUrl(
      parseInt(id),
      req.user.identificacion
    );
  }


  @ApiOperation({ summary: 'Obtener diagnósticos del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de diagnósticos asociados al usuario autenticado, según su rol.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'ID del diagnóstico' },
          fecha: { type: 'string', format: 'date-time', description: 'Fecha del diagnóstico' },
          paciente: {
            type: 'object',
            description: 'Información del paciente (si el usuario es un médico)',
            properties: {
              nombre_completo: { type: 'string', description: 'Nombre completo del paciente' },
              correo_electronico: { type: 'string', description: 'Correo electrónico del paciente' },
              edad: { type: 'integer', description: 'Edad del paciente calculada' },
            },
          },
          medico: {
            type: 'object',
            description: 'Información del médico (si el usuario es un paciente)',
            properties: {
              nombre_completo: { type: 'string', description: 'Nombre completo del médico' },
              correo_electronico: { type: 'string', description: 'Correo electrónico del médico' },
            },
          },
          edad_paciente: {
            type: 'integer',
            description: 'Edad del paciente calculada (solo si el usuario es un paciente)',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Rol no autorizado para ver diagnósticos' })
  @Get('mis-diagnosticos')
  async getDiagnosticos(@Request() req) {
    const { identificacion, rol } = req.user;

    if (rol === 'M') {
      return this.diagnosticoService.getDiagnosticosByMedico(identificacion);
    } else if (rol === 'P') {
      return this.diagnosticoService.getDiagnosticosByPaciente(identificacion, rol);
    } else {
      throw new ForbiddenException('Rol no autorizado para ver diagnósticos');
    }
  }
  @ApiOperation({ summary: 'Obtener diagnósticos de un paciente específico (solo para médicos)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del paciente para obtener sus diagnósticos',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de diagnósticos del paciente especificado',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'ID del diagnóstico' },
          fecha: { type: 'string', format: 'date-time', description: 'Fecha del diagnóstico' },
          medico: {
            type: 'object',
            properties: {
              nombre_completo: { type: 'string', description: 'Nombre completo del médico' },
              correo_electronico: { type: 'string', description: 'Correo electrónico del médico' },
            },
          },
          edad_paciente: { type: 'integer', description: 'Edad calculada del paciente' },
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Rol no autorizado para ver los diagnósticos de este paciente' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado' })
  @Get('paciente/:id')
  @Roles(Role.Medico) // Solo los médicos pueden ver diagnósticos de otros pacientes
  async getDiagnosticosByPaciente(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.diagnosticoService.getDiagnosticosByPaciente(id, req.user.rol);
  }


  @ApiOperation({ summary: 'Obtener un diagnóstico específico (para médicos y pacientes)' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del diagnóstico a obtener',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del diagnóstico obtenido exitosamente.',
    content: {
      'application/json': {
        schema: {
          oneOf: [
            {
              type: 'object',
              description: 'Respuesta para médicos',
              properties: {
                id: { type: 'integer', description: 'ID del diagnóstico' },
                fecha: { type: 'string', format: 'date-time', description: 'Fecha del diagnóstico' },
                paciente: {
                  type: 'object',
                  properties: {
                    nombre_completo: { type: 'string', description: 'Nombre completo del paciente' },
                    correo_electronico: { type: 'string', description: 'Correo electrónico del paciente' },
                    edad: { type: 'integer', description: 'Edad calculada del paciente' },
                  },
                },
                secureUrls: {
                  type: 'object',
                  properties: {
                    imageUrl: { type: 'string', description: 'URL segura de la imagen' },
                    videoUrl: { type: 'string', description: 'URL segura del video' },
                  },
                },
              },
            },
            {
              type: 'object',
              description: 'Respuesta para pacientes',
              properties: {
                id: { type: 'integer', description: 'ID del diagnóstico' },
                fecha: { type: 'string', format: 'date-time', description: 'Fecha del diagnóstico' },
                medico: {
                  type: 'object',
                  properties: {
                    nombre_completo: { type: 'string', description: 'Nombre completo del médico' },
                    correo_electronico: { type: 'string', description: 'Correo electrónico del médico' },
                  },
                },
                edad_paciente: { type: 'integer', description: 'Edad calculada del paciente' },
                secureUrls: {
                  type: 'object',
                  properties: {
                    imageUrl: { type: 'string', description: 'URL segura de la imagen' },
                    videoUrl: { type: 'string', description: 'URL segura del video' },
                  },
                },
              },
            },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: 'El usuario no tiene acceso a este diagnóstico' })
  @ApiResponse({ status: 404, description: 'Diagnóstico no encontrado' })
  @Get(':id')
  @Roles(Role.Medico, Role.Paciente)
  async getDiagnostico(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.diagnosticoService.getDiagnosticoById(
      id,
      req.user.identificacion,
      req.user.rol
    );
  }

  @Put('calificacion/:id/:calificacion')
  @Roles(Role.Paciente)
  async calificarDiagnostico(
    @Param('id', ParseIntPipe) id: number,
    @Param('calificacion', ParseIntPipe) calificacion: number,
    @Request() req
  ){
    return this.diagnosticoService.calificarDiagnostico(id, calificacion, req.user.identificacion);
  }
}