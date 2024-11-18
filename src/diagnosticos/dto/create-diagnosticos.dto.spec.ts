import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateDiagnosticoDto } from './create-diagnosticos.dto';

describe('CreateDiagnosticoDto', () => {
  it('should validate a correct DTO', async () => {
    const dto = {
      pacienteId: 12345,
      descripcion: 'Descripción válida con más de 10 caracteres',
      edadGestacional: 28,
      calificacion: 5,
    };

    const instance = plainToClass(CreateDiagnosticoDto, dto);
    const errors = await validate(instance);

    expect(errors).toHaveLength(0);
  });

  it('should fail if pacienteId is missing', async () => {
    const dto = {
      descripcion: 'Descripción válida con más de 10 caracteres',
      edadGestacional: 28,
    };

    const instance = plainToClass(CreateDiagnosticoDto, dto);
    const errors = await validate(instance);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail if descripcion is too short', async () => {
    const dto = {
      pacienteId: 12345,
      descripcion: 'Corta',
      edadGestacional: 28,
    };

    const instance = plainToClass(CreateDiagnosticoDto, dto);
    const errors = await validate(instance);

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('minLength');
  });

  it('should pass with optional calificacion', async () => {
    const dto = {
      pacienteId: 12345,
      descripcion: 'Descripción válida con más de 10 caracteres',
      edadGestacional: 28,
    };

    const instance = plainToClass(CreateDiagnosticoDto, dto);
    const errors = await validate(instance);

    expect(errors).toHaveLength(0);
  });
});