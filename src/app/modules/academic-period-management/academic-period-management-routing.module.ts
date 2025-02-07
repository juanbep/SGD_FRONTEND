import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AcademicPeriodManagementComponent } from './pages/academic-period-management/academic-period-management.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AcademicPeriodManagementComponent
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
export class AcademicPeriodManagementRoutingModule { }
