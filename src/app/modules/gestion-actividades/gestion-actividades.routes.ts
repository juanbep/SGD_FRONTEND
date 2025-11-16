import { Routes } from '@angular/router';

export const GESTION_ACTIVIDADES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'docencia',
    pathMatch: 'full',
  },
  {
    path: 'docencia',
    loadComponent: () =>
      import('./docencia/docencia.component').then((m) => m.DocenciaComponent),
  },
  {
    path: 'investigacion',
    loadComponent: () =>
      import('./investigacion/investigacion.component').then(
        (m) => m.InvestigacionComponent
      ),
  },
  {
    path: 'administracion',
    loadComponent: () =>
      import('./otros_tipos/administracion/administracion.component').then(
        (m) => m.AdministracionComponent
      ),
  },
  {
    path: 'asesoria',
    loadComponent: () =>
      import('./otros_tipos/asesoria/asesoria.component').then(
        (m) => m.AsesoriaComponent
      ),
  },
  {
    path: 'servicios',
    loadComponent: () =>
      import('./otros_tipos/servicios/servicios.component').then(
        (m) => m.ServiciosComponent
      ),
  },
  {
    path: 'extension',
    loadComponent: () =>
      import('./otros_tipos/extension/extension.component').then(
        (m) => m.ExtensionComponent
      ),
  },
  {
    path: 'capacitacion',
    loadComponent: () =>
      import('./otros_tipos/capacitacion/capacitacion.component').then(
        (m) => m.CapacitacionComponent
      ),
  },
  {
    path: 'otros-servicios',
    loadComponent: () =>
      import('./otros_tipos/otros-servicios/otros-servicios.component').then(
        (m) => m.OtrosServiciosComponent
      ),
  },
];
