import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { CommonModule } from '@angular/common';
import { AcademicPeriodManagementComponent } from '../academic-period-management/pages/academic-period-management/academic-period-management.component';
import { CatalogResolverService } from '../../resolvers/catalog.resolver.service';
import { CurrentUserResolverService } from '../../resolvers/currentUser.resolver.service';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: 'home',
                loadComponent: () => import('./pages/main/main.component').then(m => m.MainComponent),
            },
            {
                path: 'gestion-periodo-academico',
                loadChildren: () => import('../academic-period-management/academic-period-management-routing.module').then(m => m.AcademicPeriodManagementRoutingModule),
            },
            {
                path: 'gestion-usuarios',
                resolve: {currentUser: CurrentUserResolverService},
                loadChildren: () => import('../user-management/user-management-routing.module').then(m => m.UserManagementRoutingModule),
                
            },
            {
                path: 'gestion-soportes',
                loadChildren: () => import('../support-management/support-management-routing.module').then(m => m.SupportManagementRoutingModule),
                title: 'Gestión de Soportes'
            }
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule
    ],
    exports: [
        RouterModule
    ]
})
export class LayoutRoutingModule { }
