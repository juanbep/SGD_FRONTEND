import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environments_sgd';

@Injectable({
  providedIn: 'root',
})
export class RldService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/rld/pdf`;

  async descargarRLD(oidDocente: number, oidCalendario: number): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post(
          this.apiUrl,
          { oidDocente, oidCalendario },
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            responseType: 'blob',
            observe: 'response',
          }
        )
      );

      if (response.body) {
        // Crear un nombre de archivo descriptivo
        const nombreArchivo = `RLD_Docente_${oidDocente}_Calendario_${oidCalendario}.pdf`;

        // Crear URL temporal para el blob
        const blob = new Blob([response.body], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Crear enlace temporal y simular clic para descargar
        const link = document.createElement('a');
        link.href = url;
        link.download = nombreArchivo;
        link.click();

        // Liberar memoria
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error al descargar RLD:', error);
      throw error;
    }
  }
}
