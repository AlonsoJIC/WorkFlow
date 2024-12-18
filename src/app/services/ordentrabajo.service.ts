import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrdenTrabajo } from '../models/ordentrabajo';

@Injectable({
  providedIn: 'root'
})
export class OrdenTrabajoService {
  private modulo: string = "orden-trabajo";

  constructor(private http: HttpClient) { }

  public Listar(): Observable<OrdenTrabajo[]> {
    return this.http.get<OrdenTrabajo[]>(`${environment.api}/${this.modulo}`);
  }

  public Consultar(id: number): Observable<OrdenTrabajo> {
    return this.http.get<OrdenTrabajo>(`${environment.api}/${this.modulo}/${id}`);
  }

  public Guardar(ordentrabajo: OrdenTrabajo): Observable<boolean> {
    return this.http.post<boolean>(`${environment.api}/${this.modulo}`, ordentrabajo);
  }

  public Actualizar(ordentrabajo: OrdenTrabajo): Observable<boolean> {
    return this.http.put<boolean>(`${environment.api}/${this.modulo}`, ordentrabajo);
  }

  public Estado(idOrdentrabajo: number, estado: boolean): Observable<boolean> {
    return this.http.patch<boolean>(`${environment.api}/${this.modulo}`, { idOrdentrabajo, estado });
  }
}
