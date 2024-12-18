import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OrdenTrabajo } from '../../../../models/ordentrabajo';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { OrdenTrabajoService } from '../../../../services/ordentrabajo.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { OrdenTrabajoLinea } from '../../../../models/ordentrabajolinea';
import { LineasOrdentrabajoComponent } from '../lineas-ordentrabajo/lineas-ordentrabajo.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-listar-v',
  standalone: true,
  imports: [RouterModule, MatDialogModule, MatTableModule, MatProgressBarModule],
  templateUrl: './listar-ordentrabajo.component.html',
  styleUrl: './listar-ordentrabajo.component.css'
})
export class ListarOrdentrabajoComponent implements AfterViewInit {
  columnas: string[] = [
    "idOrdentrabajo", "codigo", "fecha", "estado", "descripcion", "opciones"
  ];
  origen = new MatTableDataSource<OrdenTrabajo>();

  // SubComponentes de la tabla.
  @ViewChild(MatPaginator) paginador!: MatPaginator;
  @ViewChild(MatSort) ordenamiento!: MatSort;

  constructor(private servicio: OrdenTrabajoService, private dialogo: MatDialog) { }

  ngAfterViewInit(): void {
    this.cargarTabla();
  }

  private cargarTabla(): void {
    this.servicio.Listar().subscribe({
      next: (ordenes: OrdenTrabajo[]) => {
        this.origen = new MatTableDataSource<OrdenTrabajo>(ordenes);
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

  public estado(idOrdenTrabajo: number, estado: boolean): void {
    let strEstado = estado ? 'activar' : 'inactivar';
    Swal.fire({
      title: "Aviso",
      text: `¿Desea ${strEstado} la matrícula?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        return this.servicio.Estado(idOrdenTrabajo, estado);
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

  public cursos(lineas: OrdenTrabajoLinea[]): void {
    this.dialogo.open(LineasOrdentrabajoComponent, {
      width: '100%',
      maxWidth: '950px',
      height: 'auto',
      hasBackdrop: true,
      maxHeight: '700px',
      disableClose: true,
      data: {
        lineas: lineas
      }
    });
  }
}
