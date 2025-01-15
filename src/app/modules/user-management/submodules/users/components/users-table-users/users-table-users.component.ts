import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UsersServiceService } from '../../services/users-service.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { Role, User, UsersResponse } from '../../../../../../core/models/users.interfaces';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from "../../../../../../shared/components/paginator/paginator.component";
import { ModalUserDetailslComponent } from "../modal-user-details/modal-user-details.component";
import {RouterModule } from '@angular/router';

@Component({
  selector: 'user-management-users-table-users',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent,
    ModalUserDetailslComponent,
    RouterModule
],
  templateUrl: './users-table-users.component.html',
  styleUrl: './users-table-users.component.css'
})
export class UsersTableUsersComponent implements OnInit {


  @ViewChild(ModalUserDetailslComponent) modalUserDetails: ModalUserDetailslComponent | null = null;

  public currentPage: number = 1;
  public users: UsersResponse | null = null;
  
  private usersService = inject(UsersServiceService);
  private toastService = inject(MessagesInfoService); 
  
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

  viewUserDetails(userDetails: User) {
    if(this.modalUserDetails){
      this.modalUserDetails.open(userDetails);
    }
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
