import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        // component: 
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