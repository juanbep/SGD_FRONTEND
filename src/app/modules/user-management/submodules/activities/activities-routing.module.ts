import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesComponent } from './pages/activities/activities.component';

export const routes: Routes = [
    {
        path: '',
        component: ActivitiesComponent
    }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [],
    declarations: [],
    providers: [],
})
export class ActivitiesRoutingModule { }
