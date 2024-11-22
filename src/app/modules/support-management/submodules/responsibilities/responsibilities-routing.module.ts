import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResponsibilitiesComponent } from './pages/responsibilities/responsibilities.component';

export const routes: Routes = [
    {
        path: '',
        component: ResponsibilitiesComponent 
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