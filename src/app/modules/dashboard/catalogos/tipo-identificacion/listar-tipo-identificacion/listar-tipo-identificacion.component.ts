import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { TipoIdentificacion } from '../../../../../models/tipoIdentificacion';
import { TipoIdentificacionService } from '../../../../../services/tipoIdentificacion.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-listar-tipo-identificacion',
  standalone: true,
  imports: [RouterModule, MatTableModule, MatPaginatorModule, MatSortModule, MatProgressBarModule],
  templateUrl: './listar-tipo-identificacion.component.html',
  styleUrl: './listar-tipo-identificacion.component.scss'
})
export class ListarTipoIdentificacionComponent implements AfterViewInit  {
  // Variables.
  columnas: string[] = ["idTipoIdentificacion", "nombre", "mascara", "opciones"];
  origen = new MatTableDataSource<TipoIdentificacion>();

  // SubComponentes de la tabla.
  @ViewChild(MatPaginator) paginador!: MatPaginator;
  @ViewChild(MatSort) ordenamiento!: MatSort;

  constructor(private servicio: TipoIdentificacionService) { }

  ngAfterViewInit(): void {
    this.cargarTabla();
  }

  private cargarTabla(): void {
    this.servicio.Listar().subscribe({
      next: (cursos: TipoIdentificacion[]) => {
        this.origen = new MatTableDataSource<TipoIdentificacion>(cursos);
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
}
