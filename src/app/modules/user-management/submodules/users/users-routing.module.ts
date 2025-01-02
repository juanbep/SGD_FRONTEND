import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';
import { NewUserComponent } from './pages/new-user/new-user.component';

export const routes: Routes = [
    {
        path: '',
        component: UsersComponent,
    },
    {
        path: 'nuevo-usuario',
        component: NewUserComponent,
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
    ],
    declarations: [],
    providers: [],
})
export class UserRoutingModule { }
