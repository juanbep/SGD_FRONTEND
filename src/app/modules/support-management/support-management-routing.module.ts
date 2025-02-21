import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'actividades',
        canActivate: [RoleGuard],
        data: { roles: ['DOCENTE'] },
        loadChildren: () => import('./submodules/activities/activities-routing.module' ).then(m => m.ActivitiesRoutingModule),
      },
      {
        path: 'responsabilidades',
        canActivate: [RoleGuard],
        data: { roles: ['DOCENTE','JEFE DE DEPARTAMENTO','ESTUDIANTE'] },
        loadChildren: () => import('./submodules/responsibilities/responsibilities-routing.module').then(m => m.ResponsibilitiesRoutingModule)
      },
      {
        path: 'consolidado',
        canActivate: [RoleGuard],
        data: { roles: ['JEFE DE DEPARTAMENTO'] },
        loadChildren: () => import('./submodules/consolidated/consolidated-routing.module').then(m => m.ConsolidatedRoutingModule)
      },
      {
        path: 'cpd',
        loadChildren: () => import('./submodules/cpd/cpd-routing.module').then(m => m.CpdRoutingModule)
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
