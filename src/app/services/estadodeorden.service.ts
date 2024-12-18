import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EstadoOrden } from '../models/estadodeorden';

@Injectable({
  providedIn: 'root'
})
export class EstadoOrdenService {

  constructor(private http: HttpClient) { }

  public Listar(): Observable<EstadoOrden[]> {
    return this.http.get<EstadoOrden[]>(`${environment.api}/estado-orden`);
  }

  public Consultar(idEstadoOrden: number): Observable<EstadoOrden> {
    return this.http.get<EstadoOrden>(`${environment.api}/estado-orden/${idEstadoOrden}`);
  }

  public Guardar(estado: EstadoOrden): Observable<boolean> {
    return this.http.post<boolean>(`${environment.api}/estado-orden`, estado)
  }

  public Actualizar(estado: EstadoOrden): Observable<boolean> {
    return this.http.put<boolean>(`${environment.api}/estado-orden`, estado)
  }

  public Eliminar(idEstadoOrden: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.api}/estado-orden/${idEstadoOrden}`)
  }
}
