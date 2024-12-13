import { CursoMatricula } from "./cursoMatricula";
import { Estudiante } from "./estudiante";
import { Oferta } from "./oferta";

export interface Matricula {
    idMatricula: number;
    oferta: Oferta;
    estudiante: Estudiante;
    codigo: string;
    fecha: string;
    descripcion: string;
    estado: boolean;
    lineas: CursoMatricula[];
}