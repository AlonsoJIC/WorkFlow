import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Estudiante } from '../../../../models/estudiante';
import { EstudianteService } from '../../../../services/estudiante.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-listar-estudiante',
  standalone: true,
  imports: [RouterModule, MatTableModule, MatPaginatorModule, MatSortModule, MatProgressBarModule],
  templateUrl: './listar-estudiante.component.html',
  styleUrl: './listar-estudiante.component.scss'
})
export class ListarEstudianteComponent implements AfterViewInit  {
  // Variables.
  columnas: string[] = [
    "idEstudiante", "tipoIdentificacion", "identificacion", "nombre", 
    "correo", "telefono", "fechaNacimiento", "direccion", "estado", "opciones"
  ];
  origen = new MatTableDataSource<Estudiante>();

  // SubComponentes de la tabla.
  @ViewChild(MatPaginator) paginador!: MatPaginator;
  @ViewChild(MatSort) ordenamiento!: MatSort;

  constructor(private servicio: EstudianteService) { }

  ngAfterViewInit(): void {
      this.cargarTabla();
  }

  private cargarTabla(): void {
    this.servicio.Listar().subscribe({
      next: (cursos: Estudiante[]) => {
        this.origen = new MatTableDataSource<Estudiante>(cursos);
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
      text: `¿Desea ${strEstado} el estudiante?`,
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
