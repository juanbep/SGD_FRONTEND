import { Component, inject, OnInit } from '@angular/core';
import { UsersServiceService } from '../../services/users-service.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { Role, Users } from '../../../../../../core/models/users.interfaces';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from "../../../../../../shared/components/paginator/paginator.component";

@Component({
  selector: 'user-management-users-table-users',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent
],
  templateUrl: './users-table-users.component.html',
  styleUrl: './users-table-users.component.css'
})
export class UsersTableUsersComponent implements OnInit {

  currentPage: number = 1;
  users: Users | null = null;
  
  usersService = inject(UsersServiceService);
  toastService = inject(MessagesInfoService); 
  
  ngOnInit(): void {
    this.getAllUsers(this.currentPage, 5);
  }
  

  getAllUsers(page: number, totalPage: number) {
    this.usersService.getAllUsers(page-1, totalPage).subscribe({
      next: (data) => {
        this.users = data;
        console.log(data);
      },
      error: (error) => {
        this.toastService.showErrorMessage('Error al obtener los usuarios', 'Error');
      }
    })
  }


  returnAllRoles(roles: Role[]) {
    let rolesString = '';
    roles.forEach((role:Role)=> {
      rolesString += role.nombre + ', ';
    })
    return rolesString.slice(0, -2);
  }

  pageChanged(event: any) {
    this.currentPage = event;
    this.getAllUsers(this.currentPage, 5);
  }


}
