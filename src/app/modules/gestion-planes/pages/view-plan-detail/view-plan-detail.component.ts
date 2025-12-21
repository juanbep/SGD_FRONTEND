import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoPlan, Plan } from '../../models';
import { ListMateriasComponent } from '../../components/list-materias/list-materias.component';
import { PlanService } from '../../services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-plan-detail',
  standalone: true,
  imports: [CommonModule, ListMateriasComponent],
  templateUrl: './view-plan-detail.component.html',
  styleUrl: './view-plan-detail.component.css',
})
export class ViewPlanDetailComponent implements OnInit {
  // ===== SERVICIOS =====
  private planService = inject(PlanService);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // ===== ESTADO =====
  planSeleccionado: Plan | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    // Obtener el ID del plan desde la ruta
    const oidPlanParam = this.route.snapshot.paramMap.get('id');

    if (oidPlanParam) {
      const oidPlan = Number(oidPlanParam);

      if (isNaN(oidPlan)) {
        this.error = 'ID de plan no válido';
        this.toastr.error('El ID del plan no es válido');
        return;
      }

      this.cargarPlan(oidPlan);
    } else {
      this.error = 'No se especificó un plan';
      this.toastr.error('No se especificó un plan válido');
    }
  }

  cargarPlan(oidPlan: number): void {
    this.loading = true;
    this.error = null;

    this.planService.getPlanById(oidPlan).subscribe({
      next: (response) => {
        if (response.codigo >= 200 && response.codigo < 300) {
          this.planSeleccionado = response.data;
        } else {
          this.error = response.mensaje || 'No se pudo cargar el plan';
          this.toastr.warning(response.mensaje || 'No se pudo cargar el plan');
        }
        this.loading = false;
      },
      error: (error) => {
        this.handleError(error);
        this.loading = false;
      },
    });
  }

  getBadgeClass(estado: EstadoPlan | undefined): string {
    if (!estado) return 'bg-secondary';

    const clases: Record<EstadoPlan, string> = {
      ACTIVO: 'bg-success',
      INACTIVO: 'bg-secondary',
    };
    return clases[estado] || 'bg-secondary';
  }

  volverALista(): void {
    this.router.navigate(['app/gestion-planes/management']);
  }

  private handleError(error: any): void {
    const codigoBackend = error?.error?.codigo || error.status || '—';
    const mensajeBackend =
      error?.error?.mensaje ||
      error?.message ||
      'Error al cargar el plan. Intenta de nuevo.';

    this.error = `Status Code: ${codigoBackend} - ${mensajeBackend}`;

    this.toastr.error(
      `Status Code: ${codigoBackend} - ${mensajeBackend}`,
      'Error al cargar plan'
    );
  }

  reintentar(): void {
    const oidPlanParam = this.route.snapshot.paramMap.get('id');
    if (oidPlanParam) {
      this.cargarPlan(Number(oidPlanParam));
    }
  }
}
