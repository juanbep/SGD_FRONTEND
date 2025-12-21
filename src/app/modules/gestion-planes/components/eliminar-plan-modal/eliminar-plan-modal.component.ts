import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Plan } from '../../models';
import { ToastrService } from 'ngx-toastr';
import { PlanService } from '../../services';

@Component({
  selector: 'app-eliminar-plan-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eliminar-plan-modal.component.html',
  styleUrl: './eliminar-plan-modal.component.css',
})
export class EliminarPlanModalComponent {
  @Input() plan!: Plan;
  @Output() onPlanEliminado = new EventEmitter<void>();
  @Output() onCancelar = new EventEmitter<void>();

  private planService = inject(PlanService);
  private toastr = inject(ToastrService);

  loading = false;

  eliminarPlan(): void {
    this.loading = true;

    this.planService.deletePlan({ oidPlan: this.plan.oidPlan }).subscribe({
      next: (response) => {
        if (response.codigo >= 200 && response.codigo < 300) {
          this.toastr.success(
            response.mensaje || 'Plan eliminado correctamente',
            'Éxito'
          );
          this.onPlanEliminado.emit();
        } else {
          this.toastr.warning(
            response.mensaje || 'Respuesta inesperada del servidor',
            'Advertencia'
          );
        }
        this.loading = false;
      },
      error: (error) => {
        const mensajeError =
          error?.error?.mensaje ||
          error?.message ||
          'Error al eliminar el plan';
        this.toastr.error(mensajeError, 'Error');
        this.loading = false;
      },
    });
  }

  cancelar(): void {
    this.onCancelar.emit();
  }
}
