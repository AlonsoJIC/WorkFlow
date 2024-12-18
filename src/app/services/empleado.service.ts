import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Empleado } from '../models/empleado';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  constructor(private http: HttpClient) { }

  public Listar(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${environment.api}/empleado`);
  }

  public Consultar(idEmpleado: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${environment.api}/empleado/${idEmpleado}`);
  }

  public ConsultarIdentificacion(identificacion: string): Observable<Empleado> {
    return this.http.get<Empleado>(`${environment.api}/empleado/identificacion/${identificacion}`);
  }

  public Guardar(empleado: Empleado): Observable<boolean> {
    return this.http.post<boolean>(`${environment.api}/empleado`, empleado)
  }

  public Actualizar(empleado: Empleado): Observable<boolean> {
    return this.http.put<boolean>(`${environment.api}/empleado`, empleado)
  }

  public Estado(idEmpleado: number, estado: boolean): Observable<boolean> {
    return this.http.patch<boolean>(`${environment.api}/empleado`, { idEmpleado, estado })
  }
  
  public Eliminar(idEmpleado: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.api}/empleado/${idEmpleado}`);
  }
}
