import { CursoOferta } from "./cursoOferta";

export interface Oferta {
    idOferta: number;
    codigo: string;
    fechaInicio: string;
    fechaFin: string;
    descripcion: string;
    estado: boolean;
    cursos: CursoOferta[];
}