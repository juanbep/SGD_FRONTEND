import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EstadisticasService } from '../../services/estadisticas.service';
import {
  getUserRoles,
  isUserDataAvailable,
} from '../../../auth/utils/user-storage.utils';
import { NgSelectModule } from '@ng-select/ng-select';

export interface OpcionGrafico {
  valor: string;
  label: string;
  seleccionado: boolean;
}

@Component({
  selector: 'app-modal-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './modal-estadisticas.component.html',
  styleUrl: './modal-estadisticas.component.css',
})
export class ModalEstadisticasComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() calendarios: any[] = []; // Array de calendarios disponibles
  @Input() oidDepartamento: number | null = null; // Viene del usuario logueado
  @Input() departamentos: any[] = []; // Array de departamentos disponibles

  @Output() onCerrar = new EventEmitter<void>();

  private estadisticasService = inject(EstadisticasService);
  private toastr = inject(ToastrService);

  oidCalendarioSeleccionado: number | null = null;
  oidDepartamentoSeleccionado: number | null = null;
  generando: boolean = false;
  rolEspecial: boolean = false;

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

  ngOnInit(): void {
    this.verificarRolesEspeciales();

    // Si NO es secretario, usar el departamento del usuario
    if (!this.rolEspecial) {
      this.oidDepartamentoSeleccionado = this.oidDepartamento;
    }
  }

  private verificarRolesEspeciales(): void {
    if (!isUserDataAvailable()) {
      this.rolEspecial = false;
      return;
    }

    const roles = getUserRoles();
    const rolesEspeciales = [
      'SECRETARIA/O FACULTAD',
      'SECRETARIO',
      'SECRETARIA',
      'DECANO',
    ];

    this.rolEspecial = roles.some((rol) => rolesEspeciales.includes(rol));
  }

  async generarEstadisticas(): Promise<void> {
    // Validaciones
    if (!this.oidCalendarioSeleccionado) {
      this.toastr.warning('Debe seleccionar un calendario');
      return;
    }

    if (!this.oidDepartamentoSeleccionado) {
      this.toastr.error('Debe seleccionar un departamento');
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
        oidDepartamento: this.oidDepartamentoSeleccionado,
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

  toggleTodas(): void {
    const nuevoEstado = !this.todasSeleccionadas;
    this.graficos.forEach((g) => (g.seleccionado = nuevoEstado));
  }

  cerrar(): void {
    this.onCerrar.emit();
  }

  get graficosSeleccionados(): string[] {
    return this.graficos.filter((g) => g.seleccionado).map((g) => g.valor);
  }

  get todasSeleccionadas(): boolean {
    return this.graficos.every((g) => g.seleccionado);
  }

  get algunaSeleccionada(): boolean {
    return this.graficos.some((g) => g.seleccionado);
  }
}
