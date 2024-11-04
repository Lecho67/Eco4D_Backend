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
    ForbiddenException
  } from '@nestjs/common';
  import { FileFieldsInterceptor } from '@nestjs/platform-express';
  import { DiagnosticoService } from './diagnostico.service';
  import { CreateDiagnosticoDto } from './dto/create-diagnosticos.dto';
  import { AuthGuard } from 'src/auth/auth.guard';
  import { RolesGuard } from 'src/usuarios/roles/roles.guard';
  import { Roles } from 'src/usuarios/roles/roles.decorator';
  import { Role } from 'src/usuarios/roles/roles.enum';
  @Controller('diagnosticos')
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
  @Get('/secure-urls/:id')
  async getSecureUrls(@Param('id') id: string, @Request() req) {
    return this.diagnosticoService.getSecureUrl(
      parseInt(id),
      req.user.identificacion
    );
  }

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

  @Get('paciente/:id')
  @Roles(Role.Medico) // Solo los médicos pueden ver diagnósticos de otros pacientes
  async getDiagnosticosByPaciente(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.diagnosticoService.getDiagnosticosByPaciente(id, req.user.rol);
  }

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

}