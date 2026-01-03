import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { PlanHelperService } from '../../../../gestion-planes/services';
import { getUserProgramaId } from '../../../../auth/utils/user-storage.utils';

@Component({
  selector: 'app-modal-seleccionar-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './modal-seleccionar-plan.component.html',
  styleUrl: './modal-seleccionar-plan.component.css',
})
export class ModalSeleccionarPlanComponent implements OnChanges {
  @Input() mostrar: boolean = false;
  @Input() oidPrograma?: number | string = 0; // Recibir oidPrograma del padre
  @Output() onCerrar = new EventEmitter<void>();
  @Output() onPlanSeleccionado = new EventEmitter<number>();

  private planHelperService = inject(PlanHelperService);
  private toastr = inject(ToastrService);

  // Dropdown de planes
  planesDisponibles: { value: number; label: string; estado: string }[] = [];
  planSeleccionado: number | null = null;
  loadingPlanes = false;

  ngOnChanges(changes: SimpleChanges): void {
    // Cuando se abra el modal, cargar planes
    if (changes['mostrar'] && this.mostrar) {
      this.cargarPlanes();
    }

    // Si cambia el oidPrograma mientras el modal está abierto, recargar planes
    if (
      changes['oidPrograma'] &&
      this.mostrar &&
      !changes['oidPrograma'].firstChange
    ) {
      this.cargarPlanes();
    }
  }

  // ===== CARGAR PLANES =====
  async cargarPlanes(): Promise<void> {
    // Validar que se haya recibido un oidPrograma válido
    if (
      !this.oidPrograma ||
      this.oidPrograma === 0 ||
      this.oidPrograma === ''
    ) {
      this.toastr.warning('No se ha seleccionado un programa');
      this.planesDisponibles = [];
      return;
    }

    try {
      this.loadingPlanes = true;

      // Usar el oidPrograma recibido como parámetro
      const planes = await this.planHelperService.getPlanesActivosByPrograma(
        Number(this.oidPrograma)
      );

      this.planesDisponibles = planes.map((plan) => ({
        value: plan.oidPlan,
        label: `Plan ${plan.numero}`,
        estado: plan.estado,
      }));

      if (this.planesDisponibles.length === 0) {
        this.toastr.info(
          'No hay planes activos disponibles para este programa'
        );
      }
    } catch (error) {
      console.error('Error al cargar planes:', error);
      this.toastr.error('Error al cargar la lista de planes');
      this.planesDisponibles = [];
    } finally {
      this.loadingPlanes = false;
    }
  }

  // ===== CONTINUAR =====
  continuar(): void {
    if (!this.planSeleccionado) {
      this.toastr.warning('Por favor seleccione un plan de estudios');
      return;
    }

    this.onPlanSeleccionado.emit(this.planSeleccionado);
    this.cerrar();
  }

  // ===== CERRAR =====
  cerrar(): void {
    this.planSeleccionado = null;
    this.planesDisponibles = [];
    this.onCerrar.emit();
  }

  cerrarSiClickFuera(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.cerrar();
    }
  }
}
