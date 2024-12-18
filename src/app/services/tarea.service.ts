import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Tarea } from '../models/tarea';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  constructor(private http: HttpClient) { }

  public Listar(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${environment.api}/tarea`);
  }

  public Consultar(idTarea: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${environment.api}/tarea/${idTarea}`);
  }

  public ConsultarNombre(nombre: string): Observable<Tarea> {
    return this.http.get<Tarea>(`${environment.api}/tarea/nombre/${nombre}`);
  }

  public Guardar(tarea: Tarea): Observable<boolean> {
    return this.http.post<boolean>(`${environment.api}/tarea`, tarea)
  }

  public Actualizar(tarea: Tarea): Observable<boolean> {
    return this.http.put<boolean>(`${environment.api}/tarea`, tarea)
  }

  public Estado(idTarea: number, estado: boolean): Observable<boolean> {
    return this.http.patch<boolean>(`${environment.api}/tarea`, { idTarea, estado })
  }
}
