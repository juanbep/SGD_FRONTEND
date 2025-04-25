import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        canActivate:[RoleGuard],
        data: { roles: ['JEFE DE DEPARTAMENTO','SECRETARIA/O FACULTAD','COORDINADOR','DECANO'] },
        path: 'estadisticas',
        loadChildren: () =>
          import('./submodules/statistics/statistics-routing.module').then(
            (m) => m.StatisticsRoutingModule
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class StatisticsManagementRoutingModule {}
