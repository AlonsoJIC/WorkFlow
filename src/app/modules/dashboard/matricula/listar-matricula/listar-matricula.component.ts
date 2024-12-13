import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Matricula } from '../../../../models/matricula';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatriculaService } from '../../../../services/matricula.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CursoMatricula } from '../../../../models/cursoMatricula';
import { LineasMatriculaComponent } from '../lineas-matricula/lineas-matricula.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-listar-matricula',
  standalone: true,
  imports: [RouterModule, MatDialogModule, MatTableModule, MatProgressBarModule],
  templateUrl: './listar-matricula.component.html',
  styleUrl: './listar-matricula.component.scss'
})
export class ListarMatriculaComponent implements AfterViewInit {
  columnas: string[] = [
    "idMatricula", "codigo", "fecha", "oferta", 
    "estudiante", "estado", "descripcion", "opciones"
  ];
  origen = new MatTableDataSource<Matricula>();

  // SubComponentes de la tabla.
  @ViewChild(MatPaginator) paginador!: MatPaginator;
  @ViewChild(MatSort) ordenamiento!: MatSort;

  constructor(private servicio: MatriculaService, private dialogo: MatDialog) {}

  ngAfterViewInit(): void {
      this.cargarTabla();
  }

  private cargarTabla(): void {
    this.servicio.Listar().subscribe({
      next: (matriculas: Matricula[]) => {
        this.origen = new MatTableDataSource<Matricula>(matriculas);
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

  public estado(idMatricula: number, estado: boolean): void {
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
        return this.servicio.Estado(idMatricula, estado);
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

  public cursos(lineas: CursoMatricula[]): void {
    this.dialogo.open(LineasMatriculaComponent, {
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
