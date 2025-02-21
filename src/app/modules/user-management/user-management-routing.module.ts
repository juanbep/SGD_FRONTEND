import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogResolverService } from '../../resolvers/catalog.resolver.service';

const routes: Routes = [
    {
        path: '',
        children:[
            {
                path: 'usuarios',
                loadChildren: () => import('./submodules/users/users-routing.module').then(m => m.UserRoutingModule)
            },
            {
                path: 'actividades',
                loadChildren: () => import('./submodules/activities/activities-routing.module').then(m => m.ActivitiesRoutingModule)
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
