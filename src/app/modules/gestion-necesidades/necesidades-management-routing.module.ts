import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';
import { ViewNecesidadDetailComponent } from './pages/view-necesidad-detail/view-necesidad-detail.component';
import { CrearNecesidadesDesdePlanComponent } from './pages/crear-necesidades-desde-plan/crear-necesidades-desde-plan.component';

const routes: Routes = [
  {
    path: '',
    children: [
      // ===== RUTAS PRINCIPALES - GESTIÓN DE NECESIDADES POR ROL (LAZY LOADING) =====
      {
        path: 'management/coordinador',
        loadComponent: () =>
          import(
            './pages/coordinador-necesidades/coordinador-necesidades.component'
          ).then((m) => m.CoordinadorNecesidadesComponent),
        canActivate: [RoleGuard],
        data: { roles: ['COORDINADOR'] },
      },
      {
        path: 'management/secretario',
        loadComponent: () =>
          import(
            './pages/secretario-necesidades/secretario-necesidades.component'
          ).then((m) => m.SecretarioNecesidadesComponent),
        canActivate: [RoleGuard],
        data: { roles: ['SECRETARIO', 'DECANO', 'SECRETARIA/O FACULTAD'] },
      },
      {
        path: 'management/jefe',
        loadComponent: () =>
          import(
            './pages/jefe-necesidades-container/jefe-necesidades-container.component'
          ).then((m) => m.JefeNecesidadesContainerComponent),
        canActivate: [RoleGuard],
        data: { roles: ['JEFE_DEPARTAMENTO', 'JEFE DE DEPARTAMENTO'] },
      },

      // ===== RUTA FALLBACK - Redirige a coordinador por defecto =====
      // El sidebar debe apuntar directamente a las rutas específicas
      {
        path: 'management',
        redirectTo: 'management/coordinador',
        pathMatch: 'full',
      },

      // ===== CREAR NECESIDADES DESDE PLAN - COORDINADOR =====
      {
        path: 'crear-desde-plan/:oidPlan/:oidCalendario',
        component: CrearNecesidadesDesdePlanComponent,
        canActivate: [RoleGuard],
        data: { roles: ['COORDINADOR', 'SECRETARIO', 'SECRETARIA/O FACULTAD'] },
      },

      // ===== DETALLE DE NECESIDAD =====
      {
        path: 'view',
        component: ViewNecesidadDetailComponent,
        canActivate: [RoleGuard],
        data: {
          roles: [
            'COORDINADOR',
            'SECRETARIO',
            'DECANO',
            'SECRETARIA/O FACULTAD',
          ],
        },
      },

      // ===== GESTIÓN DE ASIGNACIONES - JEFE DEPARTAMENTO =====
      // {
      //   path: 'asignaciones',
      //   component: AsignacionesManagementComponent,
      //   canActivate: [RoleGuard],
      //   data: { roles: ['JEFE_DEPARTAMENTO', 'JEFE DE DEPARTAMENTO'] },
      // },

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
