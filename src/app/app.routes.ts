import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path:'app',
        loadChildren: ()=> import('./modules/layout/layout-routing.module').then(m=>m.LayoutRoutingModule),
        canActivate: [AuthGuard]
    },
    {
        path:'auth',
        loadChildren: ()=> import('./modules/auth/auth-routing.module').then(m=>m.AuthRoutingModule)
    },
    {
        path:'**',
        redirectTo: 'auth'
    }
];
