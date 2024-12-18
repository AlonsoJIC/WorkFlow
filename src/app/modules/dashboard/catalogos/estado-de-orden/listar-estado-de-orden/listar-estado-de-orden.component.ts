import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EstadoOrden } from '../../../../../models/estadodeorden';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { EstadoOrdenService } from '../../../../../services/estadodeorden.service';

@Component({
  selector: 'app-listar-estado-de-orden',
  standalone: true,
  imports: [RouterModule, MatTableModule, MatPaginatorModule, MatSortModule, MatProgressBarModule],
  templateUrl: './listar-estado-de-orden.component.html',
  styleUrl: './listar-estado-de-orden.component.css'
})
export class ListarEstadoOrdenComponent implements AfterViewInit {
  // Variables.
  columnas: string[] = ["idEstadoOrden", "nombre", "editar"];
  origen = new MatTableDataSource<EstadoOrden>();

  // SubComponentes de la tabla.
  @ViewChild(MatPaginator) paginador!: MatPaginator;
  @ViewChild(MatSort) ordenamiento!: MatSort;

  constructor(private servicio: EstadoOrdenService) { }

  ngAfterViewInit(): void {
    this.cargarTabla();
  }

  private cargarTabla(): void {
    this.servicio.Listar().pipe(
      catchError((e) => {
        console.error('Error al cargar los estados de orden', e);
        return of([]); // Devuelve un array vacío en caso de error.
      })
    ).subscribe((estado: EstadoOrden[]) => {
      this.origen = new MatTableDataSource<EstadoOrden>(estado);
      this.origen.paginator = this.paginador;
      this.origen.sort = this.ordenamiento;
    });
  }

  public filtrar(contenido: string): void {
    this.origen.filter = contenido.trim().toLocaleLowerCase();
  }
}
