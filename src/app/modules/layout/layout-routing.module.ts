import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { CommonModule } from '@angular/common';
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
                path: 'perfil-usuario',
                loadComponent: () => import('./pages/user-info/user-info.component').then(m => m.UserInfoComponent),
            },
            {
                path: 'gestion-periodo-academico',
                loadChildren: () => import('../academic-period-management/academic-period-management-routing.module').then(m => m.AcademicPeriodManagementRoutingModule),
            },
            {
                path: 'gestion-usuarios',
                loadChildren: () => import('../user-management/user-management-routing.module').then(m => m.UserManagementRoutingModule),
                
            },
            {
                path: 'gestion-soportes',
                loadChildren: () => import('../support-management/support-management-routing.module').then(m => m.SupportManagementRoutingModule),
                title: 'Gestión de Soportes'
            },
            {
                path: 'gestion-estadisticas',
                loadChildren: () => import('../statistics-management/statistics-management-routing.module').then(m => m.StatisticsManagementRoutingModule),
                title: 'Gestión de Estadísticas'
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
