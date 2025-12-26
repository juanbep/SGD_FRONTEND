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
import { PlanHelperService } from '../../../gestion-planes/services';
import { ToastrService } from 'ngx-toastr';
import { getUserProgramaId } from '../../../auth/utils/user-storage.utils';

@Component({
  selector: 'app-modal-seleccionar-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './modal-seleccionar-plan.component.html',
  styleUrl: './modal-seleccionar-plan.component.css',
})
export class ModalSeleccionarPlanComponent implements OnChanges {
  @Input() mostrar: boolean = false;
  @Output() onCerrar = new EventEmitter<void>();
  @Output() onPlanSeleccionado = new EventEmitter<number>();

  private planHelperService = inject(PlanHelperService);
  private toastr = inject(ToastrService);

  // Dropdown de planes
  planesDisponibles: { value: number; label: string; estado: string }[] = [];
  planSeleccionado: number | null = null;
  loadingPlanes = false;

  // OID Programa del usuario
  private oidPrograma: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    // Cuando se abra el modal, cargar planes
    if (changes['mostrar'] && this.mostrar) {
      this.obtenerProgramaUsuario();
      this.cargarPlanes();
    }
  }

  // ===== OBTENER PROGRAMA DEL USUARIO =====
  private obtenerProgramaUsuario(): void {
    this.oidPrograma = getUserProgramaId();

    if (!this.oidPrograma || this.oidPrograma === 0) {
      console.error('No se pudo obtener el programa del usuario logueado');
      this.toastr.error(
        'No se pudo obtener el programa del usuario',
        'Error de autenticación'
      );
    }
  }

  // ===== CARGAR PLANES =====
  async cargarPlanes(): Promise<void> {
    if (!this.oidPrograma || this.oidPrograma === 0) {
      this.toastr.error('No se ha identificado el programa del usuario');
      return;
    }

    try {
      this.loadingPlanes = true;

      const planes = await this.planHelperService.getPlanesActivosByPrograma(
        this.oidPrograma
      );

      this.planesDisponibles = planes.map((plan) => ({
        value: plan.oidPlan,
        label: `Plan ${plan.numero}`,
        estado: plan.estado,
      }));
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
