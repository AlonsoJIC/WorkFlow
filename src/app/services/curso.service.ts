import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Curso } from '../models/curso';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  constructor(private http: HttpClient) { }

  public Listar(): Observable<Curso[]> {
    return this.http.get<Curso[]>(`${environment.api}/curso`);
  }

  public Consultar(idCurso: number): Observable<Curso> {
    return this.http.get<Curso>(`${environment.api}/curso/${idCurso}`);
  }

  public ConsultarCodigo(codigo: string): Observable<Curso> {
    return this.http.get<Curso>(`${environment.api}/curso/codigo/${codigo}`);
  }

  public Guardar(curso: Curso): Observable<boolean> {
    return this.http.post<boolean>(`${environment.api}/curso`, curso)
  }

  public Actualizar(curso: Curso): Observable<boolean> {
    return this.http.put<boolean>(`${environment.api}/curso`, curso)
  }

  public Estado(idCurso: number, estado: boolean): Observable<boolean> {
    return this.http.patch<boolean>(`${environment.api}/curso`, { idCurso, estado })
  }
}
