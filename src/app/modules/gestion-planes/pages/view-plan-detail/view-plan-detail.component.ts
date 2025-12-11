import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoPlan, Plan } from '../../models';
import { ListMateriasComponent } from '../../components/list-materias/list-materias.component';

@Component({
  selector: 'app-view-plan-detail',
  standalone: true,
  imports: [CommonModule, ListMateriasComponent],
  templateUrl: './view-plan-detail.component.html',
  styleUrl: './view-plan-detail.component.css',
})
export class ViewPlanDetailComponent implements OnInit {
  planSeleccionado: Plan | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Obtener el ID del plan desde la ruta
    const oidPlan = this.route.snapshot.paramMap.get('id');

    if (oidPlan) {
      this.cargarPlan(Number(oidPlan));
    }
  }

  cargarPlan(oidPlan: number): void {
    // MOCK - Reemplazar con servicio real
    // Simular la carga del plan
    setTimeout(() => {
      this.planSeleccionado = {
        oidPlan: 1,
        numero: '001',
        estado: 'ACTIVO',
        fechaAprobacion: '2024-01-15',
        acuerdo: 'ACU-2024-001',
        oidPrograma: 101,
        nombrePrograma: 'Ingeniería de Sistemas',
        fechaCreacion: '2024-01-10',
        fechaActualizacion: '2024-01-15',
        usuarioCreacion: 'admin',
        usuarioActualizacion: 'admin',
      };
    }, 300);
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
}
