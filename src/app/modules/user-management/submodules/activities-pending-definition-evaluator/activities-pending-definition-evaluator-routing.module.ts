import { RouterModule, Routes } from '@angular/router';
import { ActivitiesPendingDefinitionEvaluatorComponent } from './pages/activities-pending-definition-evaluator/activities-pending-definition-evaluator.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {
        path: '',
        component: ActivitiesPendingDefinitionEvaluatorComponent,
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

export class ActivitiesPendingDefinitionEvaluatorRoutingModule { }