import { TipoIdentificacion } from "./tipoIdentificacion";

export interface Profesional {
    idProfesional: number;
    tipoIdentificacion: TipoIdentificacion;
    identificacion: string;
    nombre: string;
    apellidos: string;
    fechaNacimiento: Date;
    correo: string;
    telefono: string;
    especialidad: string;
    direccion: string;
    estado: boolean;
}