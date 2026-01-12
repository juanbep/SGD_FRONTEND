import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EstadisticasService } from '../../services/estadisticas.service';

export interface OpcionGrafico {
  valor: string;
  label: string;
  seleccionado: boolean;
}

@Component({
  selector: 'app-modal-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-estadisticas.component.html',
  styleUrl: './modal-estadisticas.component.css',
})
export class ModalEstadisticasComponent {
  @Input() visible: boolean = false;
  @Input() calendarios: any[] = []; // Array de calendarios disponibles
  @Input() oidDepartamento: number | null = null; // Viene del usuario logueado

  @Output() onCerrar = new EventEmitter<void>();

  private estadisticasService = inject(EstadisticasService);
  private toastr = inject(ToastrService);

  oidCalendarioSeleccionado: number | null = null;
  generando: boolean = false;

  graficos: OpcionGrafico[] = [
    {
      valor: 'carga_actividades',
      label: 'Carga de Actividades',
      seleccionado: true,
    },
    {
      valor: 'ocupacion_cupos',
      label: 'Ocupación de Cupos',
      seleccionado: true,
    },
    {
      valor: 'cobertura_docente',
      label: 'Cobertura Docente',
      seleccionado: true,
    },
    {
      valor: 'demanda_necesidades',
      label: 'Demanda de Necesidades',
      seleccionado: true,
    },
    {
      valor: 'flujo_necesidades',
      label: 'Flujo de Necesidades',
      seleccionado: true,
    },
    {
      valor: 'cobertura_necesidades_actividades',
      label: 'Cobertura Necesidades/Actividades',
      seleccionado: true,
    },
  ];

  get graficosSeleccionados(): string[] {
    return this.graficos.filter((g) => g.seleccionado).map((g) => g.valor);
  }

  get todasSeleccionadas(): boolean {
    return this.graficos.every((g) => g.seleccionado);
  }

  get algunaSeleccionada(): boolean {
    return this.graficos.some((g) => g.seleccionado);
  }

  toggleTodas(): void {
    const nuevoEstado = !this.todasSeleccionadas;
    this.graficos.forEach((g) => (g.seleccionado = nuevoEstado));
  }

  async generarEstadisticas(): Promise<void> {
    // Validaciones
    if (!this.oidCalendarioSeleccionado) {
      this.toastr.warning('Debe seleccionar un calendario');
      return;
    }

    if (!this.oidDepartamento) {
      this.toastr.error('No se pudo obtener el departamento del usuario');
      return;
    }

    if (this.graficosSeleccionados.length === 0) {
      this.toastr.warning('Debe seleccionar al menos un gráfico');
      return;
    }

    this.generando = true;

    try {
      await this.estadisticasService.generarEstadisticas({
        oidCalendario: this.oidCalendarioSeleccionado,
        oidDepartamento: this.oidDepartamento,
        graficos: this.graficosSeleccionados,
      });

      this.toastr.success('Estadísticas generadas correctamente');
      this.cerrar();
    } catch (error: any) {
      console.error('Error al generar estadísticas:', error);
      const mensaje =
        error?.error?.mensaje || 'Error al generar las estadísticas';
      this.toastr.error(mensaje);
    } finally {
      this.generando = false;
    }
  }

  cerrar(): void {
    this.onCerrar.emit();
  }
}
