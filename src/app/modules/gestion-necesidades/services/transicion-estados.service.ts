import { inject, Injectable } from '@angular/core';
import { EstadoNecesidadesHelperService } from './estados/estado-necesidades-helper.service';
import { ToastrService } from 'ngx-toastr';
import { CambioEstadoData, NecesidadFilters } from '../models';

export interface ResultadoTransicion {
  exitoso: boolean;
  totalAfectadas: number;
  mensaje: string;
}

export interface ConfiguracionTransicion {
  titulo: string;
  mensaje: string;
  mensajeSecundario: string;
  tipoBoton: 'primary' | 'success' | 'danger' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class TransicionEstadosService {
  private estadoNecesidadesHelper = inject(EstadoNecesidadesHelperService);
  private toastr = inject(ToastrService);

  /**
   * Valida que los filtros necesarios estén presentes
   */
  validarFiltrosBasicos(filtros: NecesidadFilters): boolean {
    if (!filtros.oidCalendario || !filtros.oidPrograma) {
      this.toastr.error(
        'Debe seleccionar un calendario y programa',
        'Validación'
      );
      return false;
    }
    return true;
  }

  /**
   * Valida que el departamento esté presente (para transiciones que lo requieren)
   */
  validarDepartamento(filtros: NecesidadFilters): boolean {
    if (!filtros.oidDepartamento) {
      this.toastr.warning(
        'Esta transición requiere que seleccione un departamento en los filtros',
        'Departamento requerido'
      );
      return false;
    }
    return true;
  }

  /**
   * Genera la configuración del modal según la transición
   */
  generarConfiguracionModal(
    estadoOrigen: string,
    estadoDestino: string,
    tituloAccion: string,
    totalNecesidades: number,
    usarSeleccion: boolean
  ): ConfiguracionTransicion {
    return {
      titulo: tituloAccion,
      mensaje: usarSeleccion
        ? `¿Está seguro de cambiar el estado de las ${totalNecesidades} necesidades SELECCIONADAS?`
        : `¿Está seguro de cambiar el estado de TODAS las ${totalNecesidades} necesidades del programa?`,
      mensajeSecundario: usarSeleccion
        ? `Las necesidades seleccionadas pasarán de "${estadoOrigen}" a "${estadoDestino}".`
        : `Todas las necesidades del calendario y programa actual pasarán de "${estadoOrigen}" a "${estadoDestino}".`,
      tipoBoton: this.getTipoBotonPorEstado(estadoDestino),
    };
  }

  /**
   * Determina el color del botón según el estado destino
   */
  private getTipoBotonPorEstado(
    estadoDestino: string
  ): 'primary' | 'success' | 'danger' | 'warning' | 'info' {
    switch (estadoDestino) {
      case 'EN_REVISION_SECRETARIO':
        return 'primary';
      case 'EN_REVISION_JEFE':
        return 'success';
      case 'NO_ASIGNADA':
        return 'info';
      case 'BORRADOR':
        return 'warning';
      default:
        return 'primary';
    }
  }

  /**
   * Ejecuta una transición masiva (todas del calendario+programa o solo las seleccionadas)
   * @param oidNecesidades - (Opcional) Si se envía, solo afecta esas necesidades
   */
  async ejecutarCambioDeEstado(
    estadoOrigen: string,
    estadoDestino: string,
    oidCalendario: number,
    oidPrograma: number,
    oidDepartamento?: number,
    oidNecesidades?: number[]
  ): Promise<ResultadoTransicion> {
    try {
      let resultado: CambioEstadoData | null = null;
      const transicion = `${estadoOrigen}_${estadoDestino}`;
      switch (transicion) {
        case 'BORRADOR_EN_REVISION_SECRETARIO':
          resultado =
            await this.estadoNecesidadesHelper.enviarBorradorARevisionSecretario(
              oidCalendario,
              oidPrograma,
              oidNecesidades
            );
          break;

        case 'EN_REVISION_SECRETARIO_BORRADOR':
          resultado =
            await this.estadoNecesidadesHelper.devolverRevisionSecretarioABorrador(
              oidCalendario,
              oidPrograma,
              oidNecesidades
            );
          break;

        case 'EN_REVISION_SECRETARIO_EN_REVISION_JEFE':
          // if (!oidDepartamento) {
          //   console.log("aquí está el fucking error")
          //   throw new Error('Departamento requerido para esta transición');
          // }
          resultado =
            await this.estadoNecesidadesHelper.enviarRevisionSecretarioARevisionJefe(
              oidCalendario,
              oidPrograma,
              oidNecesidades
            );
          break;

        case 'EN_REVISION_JEFE_EN_REVISION_SECRETARIO':
          if (!oidDepartamento) {
            throw new Error('Departamento requerido para esta transición');
          }
          resultado =
            await this.estadoNecesidadesHelper.devolverRevisionJefeARevisionSecretario(
              oidCalendario,
              oidPrograma,
              oidDepartamento,
              oidNecesidades
            );
          break;

        case 'EN_REVISION_JEFE_NO_ASIGNADA':
          if (!oidDepartamento) {
            throw new Error('Departamento requerido para esta transición');
          }
          resultado =
            await this.estadoNecesidadesHelper.enviarRevisionJefeANoAsignada(
              oidCalendario,
              oidDepartamento,
              oidNecesidades
            );
          break;

        case 'NO_ASIGNADA_EN_REVISION_JEFE':
          if (!oidDepartamento) {
            throw new Error('Departamento requerido para esta transición');
          }
          resultado =
            await this.estadoNecesidadesHelper.enviarNoAsignadaARevisionJefe(
              oidCalendario,
              oidDepartamento,
              oidNecesidades
            );
          break;

        default:
          throw new Error(`Transición no soportada: ${transicion}`);
      }

      if (resultado && resultado.totalNecesidades > 0) {
        return {
          exitoso: true,
          totalAfectadas: resultado.totalNecesidades,
          mensaje: `${resultado.totalNecesidades} necesidades cambiadas exitosamente`,
        };
      } else {
        return {
          exitoso: false,
          totalAfectadas: 0,
          mensaje: 'No se encontraron necesidades en el estado origen',
        };
      }
    } catch (error: any) {
      return {
        exitoso: false,
        totalAfectadas: 0,
        mensaje: error?.error?.mensaje || 'Error al cambiar estado',
      };
    }
  }

  /**
   * Muestra el resultado de la transición al usuario
   */
  mostrarResultado(resultado: ResultadoTransicion, tituloAccion: string): void {
    if (resultado.exitoso) {
      this.toastr.success(resultado.mensaje, tituloAccion);
    } else if (resultado.totalAfectadas === 0) {
      this.toastr.info(resultado.mensaje, 'Sin cambios');
    } else {
      this.toastr.error(resultado.mensaje, 'Error');
    }
  }
}
