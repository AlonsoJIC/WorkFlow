import { TipoIdentificacion } from "./tipoIdentificacion";

export interface Empleado {
    idEmpleado: number;
    tipoIdentificacion: TipoIdentificacion,
    identificacion: string;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    direccion: string;
    estado: boolean;
    puesto: string
}