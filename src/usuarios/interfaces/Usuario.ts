export interface Usuario {
  identificacion: number;
  tipoIdentificacion: string;
  nombre_completo: string;
  correo_electronico: string;
  contrasena: string;
  rol: string;
  pais: string;
  ciudad: string;
  fecha_nacimiento: Date;
}