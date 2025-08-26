import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AcademicCalendarManagementComponent } from './pages/academic-calendar-management/academic-calendar-management.component';
import { CreateAcademicCalendarComponent } from './components/create-academic-calendar/create-academic-calendar/create-academic-calendar.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AcademicCalendarManagementComponent,
      },
      {
        path: 'crear',
        component: CreateAcademicCalendarComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class AcademicCalendarManagementRoutingModule {}
