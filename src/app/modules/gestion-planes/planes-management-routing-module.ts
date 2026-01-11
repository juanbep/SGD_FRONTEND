import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';
import { PlanesManagementComponent } from './pages/planes-management/planes-management.component';
import { ViewPlanDetailComponent } from './pages/view-plan-detail/view-plan-detail.component';

const routes: Routes = [
  {
    path: 'management',
    component: PlanesManagementComponent,
    canActivate: [RoleGuard],
    data: { roles: ['COORDINADOR'] },
  },
  {
    path: 'management/:id',
    component: ViewPlanDetailComponent,
    canActivate: [RoleGuard],
    data: { roles: ['COORDINADOR'] },
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class PlanesManagementRoutingModule {}
