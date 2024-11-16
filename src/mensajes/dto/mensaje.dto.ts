import { ApiProperty } from '@nestjs/swagger';

export class MensajeDto {
    @ApiProperty({ example: 1, description: 'ID del mensaje' })
    id: number;

    @ApiProperty({
        example: 'alo mano, esa solicitud de soporte que me mandaste esta toda mal redactada',
        description: 'Descripción o contenido del mensaje',
    })
    descripcion: string;

    @ApiProperty({
        example: '2024-11-16T04:03:30.786Z',
        description: 'Fecha de creación del mensaje',
    })
    fecha: string;

    @ApiProperty({
        example: 1,
        description: 'ID de la solicitud de soporte asociada al mensaje',
    })
    solicitudId: number;

    @ApiProperty({
        example: 327950443,
        description: 'ID del autor del mensaje',
    })
    autorId: number;

    @ApiProperty({
        example: {
            nombre_completo: 'Don Admin',
        },
        description: 'Información del autor del mensaje en formato JSON',
    })
    autor: {
        nombre_completo: string;
    };
}
