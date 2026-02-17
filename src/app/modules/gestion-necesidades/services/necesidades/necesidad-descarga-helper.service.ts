import { Injectable, inject } from '@angular/core';
import { NecesidadDescargaFilters } from '../../models/necesidad-descarga.model';
import { firstValueFrom } from 'rxjs';
import { NecesidadDescargaService } from './necesidad-descarga.service';

@Injectable({
  providedIn: 'root',
})
export class NecesidadDescargaHelperService {
  private necesidadDescargaService = inject(NecesidadDescargaService);

  /**
   * Descarga las necesidades y genera el archivo automáticamente
   * @param filters Filtros de descarga
   * @param nombreArchivo Nombre personalizado del archivo (opcional)
   */
  async descargarYGuardar(
    filters: NecesidadDescargaFilters,
    nombreArchivo?: string,
  ): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.necesidadDescargaService.descargarNecesidadesConHeaders(filters),
      );

      const blob = response.body;

      // Intentar obtener el nombre del archivo desde el header
      let filename =
        nombreArchivo || this.extraerNombreArchivo(response.headers);

      // Si no hay nombre, generar uno por defecto
      if (!filename) {
        filename = this.generarNombreArchivoPorDefecto(filters);
      }

      // Descargar el archivo
      this.descargarBlob(blob, filename);

      return true;
    } catch (error) {
      console.error('Error al descargar necesidades:', error);
      return false;
    }
  }

  /**
   * Obtiene el blob sin descargarlo automáticamente
   */
  async obtenerBlob(filters: NecesidadDescargaFilters): Promise<Blob | null> {
    try {
      return await firstValueFrom(
        this.necesidadDescargaService.descargarNecesidades(filters),
      );
    } catch (error) {
      console.error('Error al obtener blob de necesidades:', error);
      return null;
    }
  }

  /**
   * Extrae el nombre del archivo del header Content-Disposition
   */
  private extraerNombreArchivo(headers: any): string | null {
    const contentDisposition = headers.get('Content-Disposition');
    if (!contentDisposition) return null;

    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
      contentDisposition,
    );
    if (matches != null && matches[1]) {
      return matches[1].replace(/['"]/g, '');
    }
    return null;
  }

  /**
   * Genera un nombre de archivo por defecto
   */
  private generarNombreArchivoPorDefecto(
    filters: NecesidadDescargaFilters,
  ): string {
    const fecha = new Date().toISOString().split('T')[0];
    const dept = filters.oidDepartamento
      ? `_dept${filters.oidDepartamento}`
      : '_todos';
    return `necesidades_calendario${filters.oidCalendario}${dept}_${fecha}.xlsx`;
  }

  /**
   * Descarga un blob como archivo
   */
  private descargarBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  /**
   * Valida si el usuario puede descargar sin especificar departamento
   */
  puedeDescargarTodosDepartamentos(roles: string[]): boolean {
    const rolesPermitidos = ['SECRETARIO', 'SECRETARIA/O FACULTAD', 'DECANO'];
    return roles.some((rol) => rolesPermitidos.includes(rol));
  }

  /**
   * Valida si el usuario puede descargar necesidades
   */
  puedeDescargarNecesidades(roles: string[]): boolean {
    const rolesPermitidos = [
      'JEFE DE DEPARTAMENTO',
      'SECRETARIO',
      'SECRETARIA/O FACULTAD',
      'COORDINADOR',
      'DECANO',
    ];
    return roles.some((rol) => rolesPermitidos.includes(rol));
  }
}
