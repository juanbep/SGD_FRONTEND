import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/view-needs/view-needs.component').then(
            (m) => m.ViewNeedsComponent
          ),
      },
      {
        path: 'gestionar',
        loadComponent: () =>
          import('./pages/manage-needs/manage-needs.component').then(
            (m) => m.ManageNeedsComponent
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class NeedsManagementRoutingModule {}
