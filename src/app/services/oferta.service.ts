import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Oferta } from '../models/oferta';

@Injectable({
  providedIn: 'root'
})
export class OfertaService {

  constructor(private http: HttpClient) { }

  public Listar(): Observable<Oferta[]> {
    return this.http.get<Oferta[]>(`${environment.api}/oferta`);
  }

  public Consultar(idOferta: number): Observable<Oferta> {
    return this.http.get<Oferta>(`${environment.api}/oferta/${idOferta}`);
  }

  public Guardar(oferta: Oferta): Observable<boolean> {
    return this.http.post<boolean>(`${environment.api}/oferta`, oferta);
  }

  public Actualizar(oferta: Oferta): Observable<boolean> {
    return this.http.put<boolean>(`${environment.api}/oferta`, oferta);
  }

  public Estado(idOferta: number, estado: boolean): Observable<boolean> {
    return this.http.patch<boolean>(`${environment.api}/oferta`, { idOferta, estado });
  }
}
