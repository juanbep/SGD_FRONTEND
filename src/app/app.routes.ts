import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CatalogResolverService } from './resolvers/catalog.resolver.service';
import { CurrentUserResolverService } from './resolvers/currentUser.resolver.service';
import { ActivePeriodResolvers } from './resolvers/active-period.resolvers.service';

export const routes: Routes = [
    {
        
        path:'app',
        resolve: {catalog: CatalogResolverService, currentUser: CurrentUserResolverService, activePeriod: ActivePeriodResolvers },
        canActivate: [AuthGuard],
        loadChildren: ()=> import('./modules/layout/layout-routing.module').then(m=>m.LayoutRoutingModule),
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
