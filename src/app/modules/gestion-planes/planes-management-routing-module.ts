import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';
import { PlanesManagementComponent } from './pages/planes-management/planes-management.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'management',
        component: PlanesManagementComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class PlanesManagementRoutingModule {}