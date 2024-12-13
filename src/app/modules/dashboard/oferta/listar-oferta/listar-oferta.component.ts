import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Oferta } from '../../../../models/oferta';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { OfertaService } from '../../../../services/oferta.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { CursoOferta } from '../../../../models/cursoOferta';
import { MatDialog } from '@angular/material/dialog';
import { CursosComponent } from '../cursos/cursos.component';

@Component({
  selector: 'app-listar-oferta',
  standalone: true,
  imports: [RouterModule, MatTableModule, MatPaginatorModule, MatSortModule, MatProgressBarModule],
  templateUrl: './listar-oferta.component.html',
  styleUrl: './listar-oferta.component.scss'
})
export class ListarOfertaComponent implements AfterViewInit {
  columnas: string[] = [
    "idOferta", "codigo", "fechaInicio", "fechaFin", "descripcion", "estado", "opciones"
  ];
  origen = new MatTableDataSource<Oferta>();

  // SubComponentes de la tabla.
  @ViewChild(MatPaginator) paginador!: MatPaginator;
  @ViewChild(MatSort) ordenamiento!: MatSort;

  constructor(private servicio: OfertaService, private dialogo: MatDialog) { }

  ngAfterViewInit(): void {
    this.cargarTabla();
  }

  private cargarTabla(): void {
    this.servicio.Listar().subscribe({
      next: (resp: Oferta[]) => {
        this.origen = new MatTableDataSource(resp);
        this.origen.paginator = this.paginador;
        this.origen.sort = this.ordenamiento;
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
      text: `¿Desea ${strEstado} la oferta?`,
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

  public cursos(cursos: CursoOferta[]): void {
    this.dialogo.open(CursosComponent, {
      width: '100%',
      maxWidth: '950px',
      height: 'auto',
      hasBackdrop: true,
      maxHeight: '700px',
      disableClose: true,
      data: { lineas: cursos }
    });
  }
}
