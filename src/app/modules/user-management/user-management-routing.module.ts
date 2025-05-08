import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivePeriodResolvers } from '../../resolvers/active-period.resolvers.service';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'usuarios',
                loadChildren: () => import('./submodules/users/users-routing.module').then(m => m.UserRoutingModule)
            },
            {

                resolve: { activePeriod: ActivePeriodResolvers },
                path: 'actividades',
                loadChildren: () => import('./submodules/activities/activities-routing.module').then(m => m.ActivitiesRoutingModule)
            },
            {
                path: 'actividades-pendientes-asignar-evaluador',
                loadChildren: () => import('./submodules/activities-pending-definition-evaluator/activities-pending-definition-evaluator-routing.module').then(m => m.ActivitiesPendingDefinitionEvaluatorRoutingModule)
            }
        ]
    }
]


@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule
    ],
    declarations: [],
    providers: [],
})
export class UserManagementRoutingModule { }
