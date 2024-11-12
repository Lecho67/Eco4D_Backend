import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateMensajeDto {
    @IsNotEmpty()
    @IsNumber()
    solicitudId: number;
    @IsNotEmpty()
    descripcion: string;
}

