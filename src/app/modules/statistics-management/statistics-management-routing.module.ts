import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
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
