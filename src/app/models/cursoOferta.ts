import { Curso } from "./curso";
import { Profesional } from "./profesional";

export interface CursoOferta {
    idCursoOferta: number;
    curso: Curso;
    profesional: Profesional;
    horaInicio: string;
    horaFin: string;
    cupoMaximo: number;
    cupoMinimo: number;
    cupoActual: number;
    numeroGrupo: number;
}