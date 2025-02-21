import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CpdComponent } from './pages/cpd/cpd.component';
import { CpdActivitiesUserComponent } from './pages/cpd-activities-user/cpd-activities-user.component';

export const routes: Routes = [
    {
        path: 'lista-docentes',
        component: CpdComponent
    },
    {
        path: 'actividades/:id',
        component: CpdActivitiesUserComponent
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

export class CpdRoutingModule { }