import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ListarCursoComponent } from './../dashboard/curso/listar-curso/listar-curso.component';
import { GuardarCursoComponent } from './../dashboard/curso/guardar-curso/guardar-curso.component';
import { ActualizarCursoComponent } from './../dashboard/curso/actualizar-curso/actualizar-curso.component';
import { InicioComponent } from './../dashboard/inicio/inicio.component';
import { ListarTipoIdentificacionComponent } from './../dashboard/catalogos/tipo-identificacion/listar-tipo-identificacion/listar-tipo-identificacion.component';
import { GuardarTipoIdentificacionComponent } from './../dashboard/catalogos/tipo-identificacion/guardar-tipo-identificacion/guardar-tipo-identificacion.component';
import { ActualizarTipoIdentificacionComponent } from './../dashboard/catalogos/tipo-identificacion/actualizar-tipo-identificacion/actualizar-tipo-identificacion.component';

export const routes: Routes = [
    { path: "cursos", title: "Cursos", component: ListarCursoComponent },
    { path: "cursos/guardar", title: "Guardar curso", component: GuardarCursoComponent },
    { path: "cursos/actualizar/:id", title: "Actualizar curso", component: ActualizarCursoComponent },
    { path: "dashboard/inicio", title: "Inicio", component: InicioComponent },

    /* Inicio Catálogos de Sistema */
    { path: "catalogos/tipos-identificacion", title: "Tipos de Identificación", component: ListarTipoIdentificacionComponent },
    { path: "catalogos/tipos-identificacion/guardar", title: "Guardar tipo de identificación", component: GuardarTipoIdentificacionComponent },
    { path: "catalogos/tipos-identificacion/actualizar/:id", title: "Actualizar tipo de identificación", component: ActualizarTipoIdentificacionComponent },

    /* Fin Catálogos de sistema */
    { path: "", redirectTo: "/dashboard/inicio", pathMatch: "full" }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }