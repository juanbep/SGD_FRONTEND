import { Component } from '@angular/core';
import { UsersTableUsersComponent } from "../../components/users-table-users/users-table-users.component";
import { UsersFilterComponent } from "../../components/users-filter/users-filter.component";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'user-managment-users',
  standalone: true,
  imports: [
    UsersTableUsersComponent,
    UsersFilterComponent,
    RouterModule
],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
}
