import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { InicioComponent } from './../dashboard/inicio/inicio.component';
import { ListarTipoIdentificacionComponent } from './../dashboard/catalogos/tipo-identificacion/listar-tipo-identificacion/listar-tipo-identificacion.component';
import { GuardarTipoIdentificacionComponent } from './../dashboard/catalogos/tipo-identificacion/guardar-tipo-identificacion/guardar-tipo-identificacion.component';
import { ActualizarTipoIdentificacionComponent } from './../dashboard/catalogos/tipo-identificacion/actualizar-tipo-identificacion/actualizar-tipo-identificacion.component';
import { DashboardComponent } from './dashboard.component';
import { ListarTareaComponent } from './tarea/listar-tarea/listar-tarea.component';
import { GuardarTareaComponent } from './tarea/guardar-tarea/guardar-tarea.component';
import { ActualizarTareaComponent } from './tarea/actualizar-tarea/actualizar-tarea.component';
import { ListarEstadoOrdenComponent } from './catalogos/estado-de-orden/listar-estado-de-orden/listar-estado-de-orden.component';
import { GuardarEstadoOrdenComponent } from './catalogos/estado-de-orden/guardar-estado-de-orden/guardar-estado-de-orden.component';
import { ListarEmpleadoComponent } from './empleado/listar-empleado/listar-empleado.component';
import { ListarOrdentrabajoComponent } from './ordentrabajo/listar-ordentrabajo/listar-ordentrabajo.component';
import { GuardarOrdenTrabajoComponent } from './ordentrabajo/guardar-ordentrabajo/guardar-ordentrabajo.component';
import { ActualizarOrdenTrabajoComponent } from './ordentrabajo/actualizar-ordentrabajo/actualizar-ordentrabajo.component';
import { GuardarEmpleadoComponent } from './empleado/guardar-empleado/guardar-empleado.component';
import { ActualizarEmpleadoComponent } from './empleado/actualizar-empleado/actualizar-empleado.component';
import { ActualizarEstadoOrdenComponent } from './catalogos/estado-de-orden/actualizar-estado-de-orden/actualizar-estado-de-orden.component';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'inicio', pathMatch: 'full' },
            { path: 'inicio', component: InicioComponent },

            { path: "catalogos/tipos-identificacion", title: "Tipos de Identificación", component: ListarTipoIdentificacionComponent },
            { path: "catalogos/tipos-identificacion/guardar", title: "Guardar tipo de identificación", component: GuardarTipoIdentificacionComponent },
            { path: "catalogos/tipos-identificacion/actualizar/:id", title: "Actualizar tipo de identificación", component: ActualizarTipoIdentificacionComponent },

            { path: "catalogos/ordenes-estado", title: "Estados De Orden", component: ListarEstadoOrdenComponent },
            { path: "catalogos/ordenes-estado/guardar", title: "Guardar Estado", component: GuardarEstadoOrdenComponent },
            { path: "catalogos/ordenes-estado/actualizar/:id", title: "Actualizar Estado", component: ActualizarEstadoOrdenComponent },

            { path: "empleados", title: "Empleados", component: ListarEmpleadoComponent },
            { path: "empleados/guardar", title: "Guardar empleado", component: GuardarEmpleadoComponent },
            { path: "empleados/actualizar/:id", title: "Actualizar empleado", component: ActualizarEmpleadoComponent },

            { path: "tareas", title: "Tareas", component: ListarTareaComponent },
            { path: "tareas/guardar", title: "Guardar tarea", component: GuardarTareaComponent },
            { path: "tareas/actualizar/:id", title: "Actualizar tarea", component: ActualizarTareaComponent },

            { path: "ordentrabajo", title: "Orden De Trabajo", component: ListarOrdentrabajoComponent },
            { path: "ordentrabajo/guardar", title: "Guardar Orden De Trabajo", component: GuardarOrdenTrabajoComponent },
            { path: "ordentrabajo/actualizar/:id", title: "Actualizar Orden De Trabajo", component: ActualizarOrdenTrabajoComponent }

        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }