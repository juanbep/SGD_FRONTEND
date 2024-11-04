import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SupportMangementComponent } from './pages/support-mangement/support-mangement.component';
import { SupportManagementResonsabilitiesComponent } from './pages/support-management-resonsabilities/support-management-resonsabilities.component';

const routes: Routes = [
  {
    path: 'actividades',
    component: SupportMangementComponent,
  },
  {
    path: 'responsabilidades',
    component: SupportManagementResonsabilitiesComponent
  }
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
