import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { SelfEvaluationFormComponent } from './pages/self-evaluation-form/self-evaluation-form.component';
import { SelfEvaluationEditFormComponent } from './pages/self-evaluation-edit-form/self-evaluation-edit-form.component';

export const routes: Routes = [
    {
        path: '',
        component: ActivitiesComponent
    },
    {
      path: 'formulario-autoevaluacion/:id',
      component: SelfEvaluationFormComponent
    },
    {
      path: 'formulario-editar-autoevaluacion/:id',
      component: SelfEvaluationEditFormComponent
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
  
export class ActivitiesRoutingModule { 
}