import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeachersListComponent } from './pages/teachers-list/teachers-list.component';
import { ConsolidatedTeacherComponent } from './pages/consolidated-teacher/consolidated-teacher.component';

export const routes: Routes = [
    {
        path: 'lista-docentes',
        component: TeachersListComponent 
    },
    {
      path: 'consolidado-docente/:id',
      component: ConsolidatedTeacherComponent
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
  }
)
  
export class ConsolidatedRoutingModule { }