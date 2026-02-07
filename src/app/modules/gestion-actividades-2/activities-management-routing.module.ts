import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';
import { ViewActivitiesComponentComponent } from './pages/view-activities-component/view-activities-component.component';
import { ManagementActivitiesComponentComponent } from './pages/management-activities-component/management-activities-component.component';
import { GestionActividadesComponent } from '../gestion-actividades/gestion-actividades.component';

const routes: Routes = [
  {
    path: 'list',
    component: ViewActivitiesComponentComponent,
    canActivate: [RoleGuard],
    data: {
      roles: [
        'JEFE DE DEPARTAMENTO',
        'COORDINADOR',
        'DOCENTE',
        'DECANO',
        'SECRETARIO',
        'SECRETARIA/O FACULTAD',
      ],
    },
  },
  {
    path: 'create',
    component: GestionActividadesComponent,
    canActivate: [RoleGuard],
    data: { roles: ['JEFE DE DEPARTAMENTO'] },
    children: [
      {
        path: '',
        redirectTo: 'docencia',
        pathMatch: 'full',
      },
      {
        path: 'docencia',
        loadComponent: () =>
          import('../gestion-actividades/docencia/docencia.component').then(
            (m) => m.DocenciaComponent
          ),
      },
      {
        path: 'investigacion',
        loadComponent: () =>
          import(
            '../gestion-actividades/investigacion/investigacion.component'
          ).then((m) => m.InvestigacionComponent),
      },
      {
        path: 'administracion',
        loadComponent: () =>
          import(
            '../gestion-actividades/otros_tipos/administracion/administracion.component'
          ).then((m) => m.AdministracionComponent),
      },
      {
        path: 'asesoria',
        loadComponent: () =>
          import(
            '../gestion-actividades/otros_tipos/asesoria/asesoria.component'
          ).then((m) => m.AsesoriaComponent),
      },
      {
        path: 'servicios',
        loadComponent: () =>
          import(
            '../gestion-actividades/otros_tipos/servicios/servicios.component'
          ).then((m) => m.ServiciosComponent),
      },
      {
        path: 'extension',
        loadComponent: () =>
          import(
            '../gestion-actividades/otros_tipos/extension/extension.component'
          ).then((m) => m.ExtensionComponent),
      },
      {
        path: 'capacitacion',
        loadComponent: () =>
          import(
            '../gestion-actividades/otros_tipos/capacitacion/capacitacion.component'
          ).then((m) => m.CapacitacionComponent),
      },
      {
        path: 'otros-servicios',
        loadComponent: () =>
          import(
            '../gestion-actividades/otros_tipos/otros-servicios/otros-servicios.component'
          ).then((m) => m.OtrosServiciosComponent),
      },
    ],
  },
  {
    path: 'management',
    component: ManagementActivitiesComponentComponent,
    canActivate: [RoleGuard],
    data: { roles: ['JEFE DE DEPARTAMENTO'] },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class ActivitiesManagementRoutingModule {}
