import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Estudiante } from '../models/estudiante';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  constructor(private http: HttpClient) { }

  public Listar(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${environment.api}/estudiante`);
  }

  public Consultar(idEstudiante: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${environment.api}/estudiante/${idEstudiante}`);
  }

  public ConsultarIdentificacion(identificacion: string): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${environment.api}/estudiante/identificacion/${identificacion}`);
  }

  public Guardar(estudiante: Estudiante): Observable<boolean> {
    return this.http.post<boolean>(`${environment.api}/estudiante`, estudiante);
  }

  public Actualizar(estudiante: Estudiante): Observable<boolean> {
    return this.http.put<boolean>(`${environment.api}/estudiante`, estudiante);
  }

  public Estado(idEstudiante: number, estado: boolean): Observable<boolean> {
    return this.http.patch<boolean>(`${environment.api}/estudiante`, { idEstudiante, estado });
  }
}
