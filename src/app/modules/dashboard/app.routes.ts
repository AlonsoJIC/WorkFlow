import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ListarCursoComponent } from './../dashboard/curso/listar-curso/listar-curso.component';
import { GuardarCursoComponent } from './../dashboard/curso/guardar-curso/guardar-curso.component';
import { ActualizarCursoComponent } from './../dashboard/curso/actualizar-curso/actualizar-curso.component';
import { InicioComponent } from './../dashboard/inicio/inicio.component';
import { ListarTipoIdentificacionComponent } from './../dashboard/catalogos/tipo-identificacion/listar-tipo-identificacion/listar-tipo-identificacion.component';
import { GuardarTipoIdentificacionComponent } from './../dashboard/catalogos/tipo-identificacion/guardar-tipo-identificacion/guardar-tipo-identificacion.component';
import { ActualizarTipoIdentificacionComponent } from './../dashboard/catalogos/tipo-identificacion/actualizar-tipo-identificacion/actualizar-tipo-identificacion.component';
import { DashboardComponent } from './dashboard.component';
import { ListarEstudianteComponent } from './estudiante/listar-estudiante/listar-estudiante.component';
import { GuardarEstudianteComponent } from './estudiante/guardar-estudiante/guardar-estudiante.component';
import { ActualizarEstudianteComponent } from './estudiante/actualizar-estudiante/actualizar-estudiante.component';
import { ListarProfesionalComponent } from './profesional/listar-profesional/listar-profesional.component';
import { GuardarProfesionalComponent } from './profesional/guardar-profesional/guardar-profesional.component';
import { ActualizarProfesionalComponent } from './profesional/actualizar-profesional/actualizar-profesional.component';
import { ListarOfertaComponent } from './oferta/listar-oferta/listar-oferta.component';
import { GuardarOfertaComponent } from './oferta/guardar-oferta/guardar-oferta.component';
import { ActualizarOfertaComponent } from './oferta/actualizar-oferta/actualizar-oferta.component';
import { ListarMatriculaComponent } from './matricula/listar-matricula/listar-matricula.component';
import { GuardarMatriculaComponent } from './matricula/guardar-matricula/guardar-matricula.component';
import { ActualizarMatriculaComponent } from './matricula/actualizar-matricula/actualizar-matricula.component';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: [
            { path: 'inicio', component: InicioComponent },
            { path: "cursos", title: "Cursos", component: ListarCursoComponent },
            { path: "cursos/guardar", title: "Guardar curso", component: GuardarCursoComponent },
            { path: "cursos/actualizar/:id", title: "Actualizar curso", component: ActualizarCursoComponent },
            { path: "catalogos/tipos-identificacion", title: "Tipos de Identificación", component: ListarTipoIdentificacionComponent },
            { path: "catalogos/tipos-identificacion/guardar", title: "Guardar tipo de identificación", component: GuardarTipoIdentificacionComponent },
            { path: "catalogos/tipos-identificacion/actualizar/:id", title: "Actualizar tipo de identificación", component: ActualizarTipoIdentificacionComponent },
            { path: '', redirectTo: 'inicio', pathMatch: 'full' },

            { path: "estudiantes", title: "Estudiantes", component: ListarEstudianteComponent },
            { path: "estudiantes/guardar", title: "Guardar estudiante", component: GuardarEstudianteComponent },
            { path: "estudiantes/actualizar/:id", title: "Actualizar estudiante", component: ActualizarEstudianteComponent },
            { path: "profesionales", title: "Profesionales", component: ListarProfesionalComponent },
            { path: "profesionales/guardar", title: "Guardar profesional", component: GuardarProfesionalComponent },
            { path: "profesionales/actualizar/:id", title: "Actualizar profesional", component: ActualizarProfesionalComponent },
            { path: "ofertas", title: "Ofertas", component: ListarOfertaComponent },
            { path: "ofertas/guardar", title: "Guardar oferta", component: GuardarOfertaComponent },
            { path: "ofertas/actualizar/:id", title: "Actualizar oferta", component: ActualizarOfertaComponent },
            { path: "matriculas", title: "Matrículas", component: ListarMatriculaComponent },
            { path: "matriculas/guardar", title: "Guardar matrícula", component: GuardarMatriculaComponent },
            { path: "matriculas/actualizar/:id", title: "Actualizar matrícula", component: ActualizarMatriculaComponent },
            { path: "", redirectTo: "/inicio", pathMatch: "full" }


        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }