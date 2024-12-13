import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Profesional } from '../../../../models/profesional';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProfesionalService } from '../../../../services/profesional.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-profesional',
  standalone: true,
  imports: [RouterModule, MatTableModule, MatPaginatorModule, MatSortModule, MatProgressBarModule],
  templateUrl: './listar-profesional.component.html',
  styleUrl: './listar-profesional.component.scss'
})
export class ListarProfesionalComponent implements AfterViewInit {
  // Variables.
  public columnas: string[] = [
    "idProfesional", "tipoIdentificacion", "identificacion",
    "nombre", "fechaNacimiento", "correo", "especialidad",
    "telefono", "estado", "opciones"
  ];
  public origen = new MatTableDataSource<Profesional>();

  // SubComponentes de la tabla.
  @ViewChild(MatPaginator) paginador!: MatPaginator;
  @ViewChild(MatSort) ordenamiento!: MatSort;

  constructor(private servicio: ProfesionalService) {}

  ngAfterViewInit(): void {
    this.cargarTabla();
  }

  private cargarTabla(): void {
    this.servicio.Listar().subscribe({
      next: (resp: Profesional[]) => {
        this.origen = new MatTableDataSource<Profesional>(resp);
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
      text: `¿Desea ${strEstado} el profesional?`,
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
