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
        data: { roles: ['Docente'] },
        loadChildren: () => import('./submodules/activities/activities-routing.module' ).then(m => m.ActivitiesRoutingModule),
      },
      {
        path: 'responsabilidades',
        canActivate: [RoleGuard],
        data: { roles: ['Docente','Jefe de departamento','Estudiante'] },
        loadChildren: () => import('./submodules/responsibilities/responsibilities-routing.module').then(m => m.ResponsibilitiesRoutingModule)
      },
      {
        path: 'consolidado',
        canActivate: [RoleGuard],
        data: { roles: ['Jefe de departamento'] },
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
