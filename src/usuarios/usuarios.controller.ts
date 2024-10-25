import { Controller, Get } from '@nestjs/common';

@Controller('usuarios')
export class UsuariosController {
    @Get('/hello')
    getHello(): string {
        return 'Hello World!';
    }




}
