import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoIdentificacion } from '../models/tipoIdentificacion';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoIdentificacionService {

  constructor(private http: HttpClient) { }

  public Listar(): Observable<TipoIdentificacion[]> {
    return this.http.get<TipoIdentificacion[]>(`${environment.api}/tipo-identificacion`);
  }

  public Consultar(idTipoIdentificacion: number): Observable<TipoIdentificacion> {
    return this.http.get<TipoIdentificacion>(`${environment.api}/tipo-identificacion/${idTipoIdentificacion}`);
  }

  public Guardar(tipo: TipoIdentificacion): Observable<boolean> {
    return this.http.post<boolean>(`${environment.api}/tipo-identificacion`, tipo)
  }

  public Actualizar(tipo: TipoIdentificacion): Observable<boolean> {
    return this.http.put<boolean>(`${environment.api}/tipo-identificacion`, tipo)
  }

  public Eliminar(idTipoIdentificacion: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.api}/tipo-identificacion/${idTipoIdentificacion}`)
  }
}
