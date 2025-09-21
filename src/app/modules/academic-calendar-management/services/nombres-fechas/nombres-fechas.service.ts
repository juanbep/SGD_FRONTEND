import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  NombreFecha,
  CrearNombreFecha,
  ActualizarNombreFecha,
  PaginatedResponse,
  BaseResponse,
} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class NombresFechasService {
  private readonly apiUrl = '/api/nombres-fechas';

  constructor(private http: HttpClient) {}

  // ===============================
  // CREATE - Crear nuevo nombre de fecha
  // ===============================
  crearNombreFecha(
    nombreFecha: CrearNombreFecha
  ): Observable<BaseResponse<NombreFecha>> {
    return this.http.post<BaseResponse<NombreFecha>>(this.apiUrl, nombreFecha);
  }

  // ===============================
  // READ - Obtener nombres de fechas paginados
  // ===============================
  obtenerNombresFechas(
    page: number = 0,
    size: number = 50
  ): Observable<PaginatedResponse<NombreFecha>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<NombreFecha>>(this.apiUrl, {
      params,
    });
  }

  // ===============================
  // READ - Obtener nombre de fecha por ID
  // ===============================
  obtenerNombreFechaPorId(
    oidNombreFecha: number
  ): Observable<BaseResponse<NombreFecha>> {
    const url = `${this.apiUrl}/${oidNombreFecha}`;
    return this.http.get<BaseResponse<NombreFecha>>(url);
  }

  // ===============================
  // UPDATE - Actualizar nombre de fecha
  // ===============================
  actualizarNombreFecha(
    oidNombreFecha: number,
    nombreFecha: ActualizarNombreFecha
  ): Observable<BaseResponse<NombreFecha>> {
    const url = `${this.apiUrl}/${oidNombreFecha}`;
    return this.http.put<BaseResponse<NombreFecha>>(url, nombreFecha);
  }

  // ===============================
  // DELETE - Eliminar nombre de fecha
  // ===============================
  eliminarNombreFecha(oidNombreFecha: number): Observable<BaseResponse<any>> {
    const url = `${this.apiUrl}/${oidNombreFecha}`;
    return this.http.delete<BaseResponse<any>>(url);
  }

  // ===============================
  // BÚSQUEDAS ESPECÍFICAS
  // ===============================

  // Buscar nombres de fechas por nombre (texto)
  buscarNombresFechasPorNombre(
    nombre: string,
    page: number = 0,
    size: number = 20
  ): Observable<PaginatedResponse<NombreFecha>> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<NombreFecha>>(this.apiUrl, {
      params,
    });
  }

  // ===============================
  // MÉTODOS UTILITARIOS
  // ===============================

  // Obtener todos los nombres de fechas (para dropdowns/selects)
  obtenerTodosLosNombresFechas(): Observable<BaseResponse<NombreFecha[]>> {
    const params = new HttpParams().set('size', '1000'); // Número grande para obtener todos

    return this.http.get<BaseResponse<NombreFecha[]>>(this.apiUrl, { params });
  }

  // Validar si un nombre ya existe
  validarNombreExistente(nombre: string): Observable<BaseResponse<boolean>> {
    const params = new HttpParams().set('validar', nombre);
    return this.http.get<BaseResponse<boolean>>(`${this.apiUrl}/validar`, {
      params,
    });
  }
}
