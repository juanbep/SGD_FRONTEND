import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { UsersComponent } from './pages/users/users.component';
import { NewActivityComponent } from './pages/new-activity/new-activity.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { EditActivityComponent } from './pages/edit-activity/edit-activity.component';
import { CatalogResolverService } from '../../../../resolvers/catalog.resolver.service';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'usuarios',
                component: UsersComponent
            },
            {
                path: 'actividades-usuario/:id',
                component: ActivitiesComponent
            },
            {
                path: 'nueva-actividad/:id',
                component: NewActivityComponent
            },
            {
                path: 'editar-actividad/:id',
                component: EditActivityComponent
            }
        ]
    },
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
