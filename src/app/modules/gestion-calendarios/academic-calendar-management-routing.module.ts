import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';
import { AcademicCalendarManagementComponent } from './pages/academic-calendar-management/academic-calendar-management.component';
import { CreateAcademicCalendarComponent } from './pages/create-academic-calendar/create-academic-calendar.component';
import { ViewAcademicCalendarComponent } from './components/view-academic-calendar/view-academic-calendar.component';
import { ViewAcademicCalendarsComponent } from './pages/view-academic-calendars/view-academic-calendars.component';
import { EditAcademicCalendarComponent } from './components/edit-academic-calendar/edit-academic-calendar.component';

const routes: Routes = [
  {
    path: 'listar',
    component: ViewAcademicCalendarsComponent,
  },
  {
    path: 'gestionar',
    component: AcademicCalendarManagementComponent,
    canActivate: [RoleGuard],
    data: { roles: ['SECRETARIA/O FACULTAD', 'SECRETARIO', 'DECANO'] },
  },
  {
    path: 'crear',
    component: CreateAcademicCalendarComponent,
    canActivate: [RoleGuard],
    data: { roles: ['SECRETARIA/O FACULTAD', 'SECRETARIO', 'DECANO'] },
  },
  {
    path: 'editar/:id',
    component: EditAcademicCalendarComponent,
    canActivate: [RoleGuard],
    data: { roles: ['SECRETARIA/O FACULTAD', 'SECRETARIO', 'DECANO'] },
  },
  {
    path: 'ver/:id',
    component: ViewAcademicCalendarComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class AcademicCalendarManagementRoutingModule {}
