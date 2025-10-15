import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';
import { AcademicCalendarManagementComponent } from './pages/academic-calendar-management/academic-calendar-management.component';
import { CreateAcademicCalendarComponent } from './components/create-academic-calendar/create-academic-calendar/create-academic-calendar.component';
import { ViewAcademicCalendarComponent } from './components/view-academic-calendar/view-academic-calendar/view-academic-calendar.component';
import { ViewAcademicCalendarsComponent } from './pages/view-academic-calendars/view-academic-calendars.component';
import { EditAcademicCalendarComponent } from './components/edit-academic-calendar/edit-academic-calendar.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AcademicCalendarManagementComponent,
      },
      {
        path: 'list',
        component: ViewAcademicCalendarsComponent,
      },
      {
        path: 'crear',
        component: CreateAcademicCalendarComponent,
      },
      {
        path: 'editar/:id',
        component: EditAcademicCalendarComponent,
      },
      {
        path: 'ver/:id',
        component: ViewAcademicCalendarComponent,
      },

      //explorar calendarios
      //crear calendario
      //gestionar calendario
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes), CommonModule],
  exports: [RouterModule],
})
export class AcademicCalendarManagementRoutingModule {}
