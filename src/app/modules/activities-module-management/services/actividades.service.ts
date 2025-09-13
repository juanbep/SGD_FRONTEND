import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActividadResponse, ActividadItem, FiltrosActividad } from '../models/actividad.interface';


@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  private readonly API_URL = 'api/actividades';

  constructor(private http: HttpClient) {}

  // GET - Obtener actividades con paginación y filtros
  obtenerActividades(
    page: number = 0, 
    size: number = 10, 
    filtros?: FiltrosActividad
  ): Observable<ActividadResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filtros) {
      Object.keys(filtros).forEach(key => {
        const value = filtros[key as keyof FiltrosActividad];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ActividadResponse>(this.API_URL, { params });
  }

  // GET - Obtener actividad por ID
  obtenerActividadPorId(id: number): Observable<ActividadItem> {
    return this.http.get<ActividadItem>(`${this.API_URL}/${id}`);
  }

  // POST - Crear nueva actividad
  crearActividad(actividad: Partial<ActividadItem>): Observable<ActividadItem> {
    return this.http.post<ActividadItem>(this.API_URL, actividad);
  }

  // PUT - Actualizar actividad
  actualizarActividad(id: number, actividad: Partial<ActividadItem>): Observable<ActividadItem> {
    return this.http.put<ActividadItem>(`${this.API_URL}/${id}`, actividad);
  }

  // DELETE - Eliminar actividad
  eliminarActividad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  // GET - Obtener tipos de actividad
  obtenerTiposActividad(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/tipos`);
  }

  // GET - Obtener calendarios
  obtenerCalendarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/calendarios`);
  }
}