import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';

import { ViewActivitiesComponentComponent } from './pages/view-activities-component/view-activities-component.component';
import { CreateActivitiesComponentComponent } from './pages/create-activities-component/create-activities-component.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ViewActivitiesComponentComponent,
      },
      {
        path: 'create',
        component: CreateActivitiesComponentComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class ActivitiesManagementRoutingModule {}
