import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResponsibilitiesComponent } from './pages/responsibilities/responsibilities.component';
import { ResponsabilitieStudentFormComponent } from './pages/responsabilitie-student-form/responsabilitie-student-form.component';
import { ReponsibilitiesEditStudentFormComponent } from './pages/reponsibilities-edit-student-form/reponsibilities-edit-student-form.component';
import { ResponsibilitieCoordinatorFormComponent } from './pages/responsibilitie-coordinator-form/responsibilitie-coordinator-form.component';
import { ResponsibilitiesEditCoordinatorFormComponent } from './pages/responsibilities-edit-coordinator-form/responsibilities-edit-coordinator-form.component';

export const routes: Routes = [
    {
        path: '',
        component: ResponsibilitiesComponent 
    },
    {
      path: 'formulario-evaluacion-docente-estudiante/:id',
      component: ResponsabilitieStudentFormComponent
    },
    {
      path: 'formulario-evaluacion-docente-estudiante-editar/:id',
      component: ReponsibilitiesEditStudentFormComponent
    },
    {
      path: 'formulario-evaluacion-docente-coordinador/:id',
      component: ResponsibilitieCoordinatorFormComponent
    },
    {
      path: 'formulario-evaluacion-docente-coordinador-editar/:id',
      component: ResponsibilitiesEditCoordinatorFormComponent
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

export class ResponsibilitiesRoutingModule { 
    
}