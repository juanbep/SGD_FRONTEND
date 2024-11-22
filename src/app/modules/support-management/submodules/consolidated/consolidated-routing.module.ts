import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsolidatedComponent } from './pages/consolidated/consolidated.component';

export const routes: Routes = [
    {
        path: '',
        component: ConsolidatedComponent 
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