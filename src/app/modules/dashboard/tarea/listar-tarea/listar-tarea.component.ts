import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { TareaService } from '../../../../services/tarea.service';
import { Tarea } from '../../../../models/tarea';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common'; // Asegúrate de incluir CommonModule
// Importa CommonModule

@Component({
  selector: 'app-listar-tarea',
  standalone: true,
  imports: [
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    CommonModule  // Asegúrate de incluir CommonModule aquí
  ],
  templateUrl: './listar-tarea.component.html',
  styleUrls: ['./listar-tarea.component.css']
})
export class ListarTareaComponent implements AfterViewInit {
  columnas: string[] = ['idTarea', 'horaInicio', 'horaFin', 'nombre', 'descripcion', 'estado', 'opciones'];
  origen = new MatTableDataSource<Tarea>();

  @ViewChild(MatPaginator) paginador!: MatPaginator;
  @ViewChild(MatSort) ordenamiento!: MatSort;

  constructor(private servicio: TareaService) { }

  ngAfterViewInit(): void {
    this.cargarTabla();
  }

  private cargarTabla(): void {
    this.servicio.Listar().subscribe({
      next: (tareas: Tarea[]) => {
        console.log('Datos recibidos:', tareas);
        this.origen = new MatTableDataSource<Tarea>(tareas);
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


  public estado(idTarea: number, estado: boolean): void {
    let strEstado = estado ? 'activar' : 'inactivar';
    Swal.fire({
      title: 'Aviso',
      text: `¿Desea ${strEstado} la tarea?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        return this.servicio.Estado(idTarea, estado);
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        let proceso = result.value as Observable<boolean>;
        proceso.subscribe({
          next: (resp: boolean) => {
            if (resp) {
              Swal.fire({
                title: 'Aviso',
                text: 'Se completó correctamente el proceso.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
            } else {
              Swal.fire({
                title: 'Aviso',
                text: 'No se completó el proceso, intente nuevamente.',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
              });
            }
          },
          error: (e: any) => {
            Swal.fire({
              title: 'Aviso',
              text: `Ocurrió un error en el proceso, referencia de respuesta: ${e.message}`,
              icon: 'error',
              confirmButtonText: 'Aceptar'
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
