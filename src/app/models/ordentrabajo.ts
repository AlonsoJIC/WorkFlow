import { Empleado } from "./empleado";
import { EstadoOrden } from "./estadodeorden";
import { OrdenTrabajoLinea } from "./ordentrabajolinea";

export interface OrdenTrabajo {
    idOrdentrabajo: number;
    empleado: Empleado,
    estadoOrden: EstadoOrden,
    fecha: string;
    descripcion: string;
    lineas: OrdenTrabajoLinea[]
}