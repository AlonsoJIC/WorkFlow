import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Matricula } from '../models/matricula';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {
  private modulo: string = "matricula";

  constructor(private http: HttpClient) { }

  public Listar(): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(`${environment.api}/${this.modulo}`);
  }

  public Consultar(id: number): Observable<Matricula> {
    return this.http.get<Matricula>(`${environment.api}/${this.modulo}/${id}`);
  }

  public ConsultarCodigo(codigo: string): Observable<Matricula> {
    return this.http.get<Matricula>(`${environment.api}/${this.modulo}/codigo/${codigo}`);
  }

  public Guardar(matricula: Matricula): Observable<boolean> {
    return this.http.post<boolean>(`${environment.api}/${this.modulo}`, matricula);
  }

  public Actualizar(matricula: Matricula): Observable<boolean> {
    return this.http.put<boolean>(`${environment.api}/${this.modulo}`, matricula);
  }

  public Estado(idMatricula: number, estado: boolean): Observable<boolean> {
    return this.http.patch<boolean>(`${environment.api}/${this.modulo}`, { idMatricula, estado });
  }
}
