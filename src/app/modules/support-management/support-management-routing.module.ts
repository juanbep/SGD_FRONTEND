import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../security/auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'actividades',
        loadChildren: () => import('./submodules/activities/activities-routing.module' ).then(m => m.ActivitiesRoutingModule),
      },
      {
        path: 'responsabilidades',
        loadChildren: () => import('./submodules/responsibilities/responsibilities-routing.module').then(m => m.ResponsibilitiesRoutingModule)
      },
      {
        path: 'consolidado',
        loadChildren: () => import('./submodules/consolidated/consolidated-routing.module').then(m => m.ConsolidatedRoutingModule)
      }
    ]
  },
]

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [
    RouterModule
  ]
})
export class SupportManagementRoutingModule { }
