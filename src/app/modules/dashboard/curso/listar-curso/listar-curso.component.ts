import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CursoService } from '../../../../services/curso.service';
import { Curso } from '../../../../models/curso';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-listar-curso',
  standalone: true,
  imports: [RouterModule, MatTableModule, MatPaginatorModule, MatSortModule, MatProgressBarModule],
  templateUrl: './listar-curso.component.html',
  styleUrl: './listar-curso.component.scss'
})
export class ListarCursoComponent implements AfterViewInit {
  // Variables.
  columnas: string[] = ["idCurso", "codigo", "nombre", "descripcion", "estado", "opciones"];
  origen = new MatTableDataSource<Curso>();

  // SubComponentes de la tabla.
  @ViewChild(MatPaginator) paginador!: MatPaginator;
  @ViewChild(MatSort) ordenamiento!: MatSort;

  constructor(private servicio: CursoService) { }

  ngAfterViewInit(): void {
    this.cargarTabla();
  }

  private cargarTabla(): void {
    this.servicio.Listar().subscribe({
      next: (cursos: Curso[]) => {
        this.origen = new MatTableDataSource<Curso>(cursos);
        this.origen.paginator = this.paginador;
        this.origen.sort = this.ordenamiento;
      },
      error: (e: any) => {
        console.error(e);
      }
    });
  }

  public filtrar(contenido: string): void {
    this.origen.filter = contenido.trim().toLocaleLowerCase();
  }

  public estado(idCurso: number, estado: boolean): void {
    let strEstado = estado ? 'activar' : 'inactivar';
    Swal.fire({
      title: "Aviso",
      text: `¿Desea ${strEstado} el curso?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        return this.servicio.Estado(idCurso, estado);
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        let proceso = result.value as Observable<boolean>;
        proceso.subscribe({
          next: (resp: boolean) => {
            if (resp) {
              Swal.fire({
                title: "Aviso",
                text: "Se completó correctamente el proceso.",
                icon: "success",
                confirmButtonText: "Aceptar"
              });
            } else {
              Swal.fire({
                title: "Aviso",
                text: "No se completó el proceso, intente nuevamente.",
                icon: "warning",
                confirmButtonText: "Aceptar"
              });
            }
          },
          error: (e: any) => {
            Swal.fire({
              title: "Aviso",
              text: `Ocurrió un error en el proceso, referencia de respuesta: ${e.message}`,
              icon: "error",
              confirmButtonText: "Aceptar"
            });
          },
          complete: () => {
            this.cargarTabla();
          }
        });
      }
    });
  }
}
