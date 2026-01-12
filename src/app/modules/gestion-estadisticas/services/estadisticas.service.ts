import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environments_sgd';

export interface EstadisticasRequest {
  oidCalendario: number;
  oidDepartamento: number;
  graficos: string[];
}

@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/estadisticas/pdf`;

  async generarEstadisticas(request: EstadisticasRequest): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post(this.apiUrl, request, {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
          responseType: 'blob',
          observe: 'response',
        })
      );

      if (response.body) {
        const nombreArchivo = `Estadisticas_Cal${request.oidCalendario}_Dep${request.oidDepartamento}.pdf`;

        const blob = new Blob([response.body], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = nombreArchivo;
        link.click();

        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error al generar estadísticas:', error);
      throw error;
    }
  }
}
