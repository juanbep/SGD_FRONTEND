import { Component } from '@angular/core';
import { ActivitiesTableComponent } from "../../components/activities-table/activities-table.component";
import { UsersTableComponent } from "../../components/users-table/users-table.component";
import { UsersFilterComponent } from "../../components/users-filter/users-filter.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [UsersTableComponent, UsersFilterComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  
}
