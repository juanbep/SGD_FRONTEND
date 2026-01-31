import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUserResolverService } from './resolvers/currentUser.resolver.service';

export const routes: Routes = [
  {
    path: 'app',
    resolve: {
      currentUser: CurrentUserResolverService,
    },
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/layout/layout-routing.module').then(
        (m) => m.LayoutRoutingModule
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth-routing.module').then(
        (m) => m.AuthRoutingModule
      ),
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
