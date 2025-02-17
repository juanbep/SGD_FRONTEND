import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';
import { DataResolverService } from '../../resolvers/data.resolver.service';
import { CatalogResolverService } from '../../resolvers/catalog.resolver.service';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'actividades',
        resolve: { teacher: DataResolverService},
        canActivate: [RoleGuard],
        data: { roles: ['DOCENTE'] },
        loadChildren: () => import('./submodules/activities/activities-routing.module' ).then(m => m.ActivitiesRoutingModule),
      },
      {
        path: 'responsabilidades',
        resolve: { teacher: DataResolverService},
        canActivate: [RoleGuard],
        data: { roles: ['DOCENTE','JEFE DE DEPARTAMENTO','ESTUDIANTE'] },
        loadChildren: () => import('./submodules/responsibilities/responsibilities-routing.module').then(m => m.ResponsibilitiesRoutingModule)
      },
      {
        path: 'consolidado',
        resolve: {catalog: CatalogResolverService, teacher: DataResolverService},
        canActivate: [RoleGuard],
        data: { roles: ['JEFE DE DEPARTAMENTO'] },
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
