import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
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

  
  private usersService = inject(ActivitiesManagementService);
  private toastService = inject(MessagesInfoService);

  public usersResponse: UsersResponse | null = null;
  public currentPage: number = 1;
  public sizePage: number = 10;
  
  public filterParams: {nameUser: string | null, identification: string | null, faculty: string | null, program: string | null, rol: string | null, state: string | null} | null = null;

  usersEffect = effect(()=>{
    this.filterParams=this.usersService.getParamsUsersFilter();
    this.currentPage = 1;
    this.getAllUsers(this.currentPage, this.sizePage);
  })


  ngOnInit(): void {
  }


  getAllUsers(page: number, totalPage: number) {
    const paramsFilter = this.usersService.getParamsUsersFilter();
    this.usersService.getUserByParams(page-1, totalPage, paramsFilter?.identification|| '',paramsFilter?.nameUser || '',paramsFilter?.faculty || '', paramsFilter?.program || '','','','','','1', paramsFilter?.state || '' ).subscribe({
      next: (data) => {
        this.usersResponse = data;
        this.usersService.setUsers(data);
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
    this.getAllUsers(this.currentPage, this.sizePage);
  }
}
