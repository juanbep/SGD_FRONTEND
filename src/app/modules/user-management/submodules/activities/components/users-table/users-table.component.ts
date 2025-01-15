import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { Role, User, UsersResponse } from '../../../../../../core/models/users.interfaces';
import { ModalUserDetailslComponent } from '../../../users/components/modal-user-details/modal-user-details.component';
import { ActivitiesManagementService } from '../../services/activities-management.service';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from "../../../../../../shared/components/paginator/paginator.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'user-management-activities-users-table',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent,
    RouterModule
],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.css'
})
export class UsersTableComponent implements OnInit {

  @ViewChild(ModalUserDetailslComponent) modalUserDetails: ModalUserDetailslComponent | null = null;


  public currentPage: number = 1;
  public usersResponse: UsersResponse | null = null;

  
  private usersService = inject(ActivitiesManagementService);
  private toastService = inject(MessagesInfoService);


  ngOnInit(): void {
    this.getAllUsers(this.currentPage, 5);
  }


  getAllUsers(page: number, totalPage: number) {
    this.usersService.getAllTeachers(page - 1, totalPage).subscribe({
      next: (data) => {
        this.usersResponse = data;
        console.log(data);
      },
      error: (error) => {
        this.toastService.showErrorMessage('Error al obtener los usuarios', 'Error');
      }
    })
  }

  viewUserDetails(userDetails: User) {
    if (this.modalUserDetails) {
      this.modalUserDetails.open(userDetails);
    }
  }


  returnAllRoles(roles: Role[]) {
    let rolesString = '';
    roles.forEach((role: Role) => {
      rolesString += role.nombre + ', ';
    })
    return rolesString.slice(0, -2);
  }

  pageChanged(event: any) {
    this.currentPage = event;
    this.getAllUsers(this.currentPage, 5);
  }
}
