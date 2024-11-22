import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesComponent } from './pages/activities/activities.component';

export const routes: Routes = [
    {
        path: '',
        component: ActivitiesComponent
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