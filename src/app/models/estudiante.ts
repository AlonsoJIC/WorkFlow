import { TipoIdentificacion } from "./tipoIdentificacion";

export interface Estudiante {
    idEstudiante: number;
    tipoIdentificacion: TipoIdentificacion,
    identificacion: string;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    fechaNacimiento: Date;
    direccion: string;
    estado: boolean;
}