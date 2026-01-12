import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';
import { EstadisticasPageComponent } from './pages/estadisticas-page/estadisticas-page.component';

const routes: Routes = [
  {
    path: '',
    component: EstadisticasPageComponent,
    canActivate: [RoleGuard],
    data: {
      roles: [
        'JEFE DE DEPARTAMENTO',
        'SECRETARIA/O FACULTAD',
        'DECANO',
        'CPD',
        'COORDINADOR',
      ],
    },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class GestionEstadisticasManagementeRoutingModule {}
