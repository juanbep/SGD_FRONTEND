import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
//import { RoleGuard } from '../../guards/role.guard';
import { NecesidadesManagementComponent } from './pages/necesidades-management/necesidades-management.component';
import { ViewNecesidadDetailComponent } from './pages/view-necesidad-detail/view-necesidad-detail.component';
import { AsignacionesManagementComponent } from './pages/asignaciones-management/asignaciones-management.component';
import { CrearNecesidadesDesdePlanComponent } from './pages/crear-necesidades-desde-plan/crear-necesidades-desde-plan.component';

const routes: Routes = [
  {
    path: '',
    children: [
      // ===== RUTA PRINCIPAL - GESTIÓN DE NECESIDADES =====
      {
        path: 'management',
        component: NecesidadesManagementComponent,
        // canActivate: [RoleGuard],
        // data: { roles: ['COORDINADOR', 'SECRETARIO', 'DECANO'] }
      },
      {
        path: 'crear-desde-plan/:oidPlan/:oidCalendario',
        component: CrearNecesidadesDesdePlanComponent,
        // canActivate: [RoleGuard],
        // data: { roles: ['COORDINADOR'] }
      },
      // ===== DETALLE DE NECESIDAD =====
      {
        path: 'view',
        component: ViewNecesidadDetailComponent,
        // canActivate: [RoleGuard],
        // data: { roles: ['COORDINADOR', 'SECRETARIO', 'DECANO'] }
      },

      // ===== GESTIÓN DE ASIGNACIONES - JEFE DEPARTAMENTO =====
      {
        path: 'asignaciones',
        component: AsignacionesManagementComponent,
        // canActivate: [RoleGuard],
        // data: { roles: ['JEFE_DEPARTAMENTO'] }
      },

      // ===== REDIRECCIÓN POR DEFECTO =====
      {
        path: '',
        redirectTo: 'management',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class NecesidadesManagementRoutingModule {}
