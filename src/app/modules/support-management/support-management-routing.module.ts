import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';
import { ActivePeriodResolvers } from '../../resolvers/active-period.resolvers.service';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'actividades',
        canActivate: [RoleGuard],
        resolve: { activePeriod: ActivePeriodResolvers},
        data: { roles:['DOCENTE'] },
        loadChildren: () => import('./submodules/activities/activities-routing.module' ).then(m => m.ActivitiesRoutingModule),
      },
      {
        path: 'responsabilidades',
        canActivate: [RoleGuard],
        resolve: { activePeriod: ActivePeriodResolvers},
        data: { roles: ['JEFE DE DEPARTAMENTO','ESTUDIANTE','COORDINADOR','DECANO','DOCENTE'] },
        loadChildren: () => import('./submodules/responsibilities/responsibilities-routing.module').then(m => m.ResponsibilitiesRoutingModule)
      },
      {
        path: 'consolidado',
        canActivate: [RoleGuard],
        resolve: { activePeriod: ActivePeriodResolvers},
        data: { roles: ['JEFE DE DEPARTAMENTO','COORDINADOR'] },
        loadChildren: () => import('./submodules/consolidated/consolidated-routing.module').then(m => m.ConsolidatedRoutingModule)
      },
      {
        path: 'cpd',
        resolve: { activePeriod: ActivePeriodResolvers},
        canActivate: [RoleGuard],
        data: { roles: ['CPD','SECRETARIA/O FACULTAD','DECANO'] },
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
