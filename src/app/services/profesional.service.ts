import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Profesional } from '../models/profesional';

@Injectable({
  providedIn: 'root'
})
export class ProfesionalService {

  constructor(private http: HttpClient) { }

  public Listar(): Observable<Profesional[]> {
    return this.http.get<Profesional[]>(`${environment.api}/profesional`);
  }

  public Consultar(idProfesional: number): Observable<Profesional> {
    return this.http.get<Profesional>(`${environment.api}/profesional/${idProfesional}`);
  }

  public ConsultarIdentificacion(identificacion: string): Observable<Profesional> {
    return this.http.get<Profesional>(`${environment.api}/profesional/identificacion/${identificacion}`);
  }

  public Guardar(profesional: Profesional): Observable<boolean> {
    return this.http.post<boolean>(`${environment.api}/profesional`, profesional)
  }

  public Actualizar(profesional: Profesional): Observable<boolean> {
    return this.http.put<boolean>(`${environment.api}/profesional`, profesional)
  }

  public Estado(idProfesional: number, estado: boolean): Observable<boolean> {
    return this.http.patch<boolean>(`${environment.api}/profesional`, { idProfesional, estado })
  }
}
