import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { UsersServiceService } from '../../services/users-service.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from "../../../../../../shared/components/paginator/paginator.component";
import { ModalUserDetailslComponent } from "../modal-user-details/modal-user-details.component";
import {RouterModule } from '@angular/router';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { Rol } from '../../../../../../core/models/base/rol.model';

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
  
  private usersService = inject(UsersServiceService);
  private toastService = inject(MessagesInfoService); 

  public currentPage: number = 1;
  public sizePage: number = 10;
  public users: PagedResponse<UsuarioResponse>| null = null;

  public filterParams: {nameUser: string | null, identification: string | null, faculty: string | null, program: string | null, rol: string | null, state: string | null} | null = null;

  usersEffect = effect(()=>{
    this.filterParams=this.usersService.getParamsFilter();
    this.currentPage = 1;
    this.getAllUsers(this.currentPage, this.sizePage);
  })
  
  ngOnInit(): void {
  

  }
  

  getAllUsers(page: number, totalPage: number) {
    const paramsFilter = this.usersService.getParamsFilter();
    this.usersService.getAllUsersByParams(page-1, totalPage, paramsFilter?.identification || '', paramsFilter?.nameUser || '', paramsFilter?.faculty || '', paramsFilter?.program || '','','','','',paramsFilter?.rol || '', paramsFilter?.state || '' ).subscribe({
      next: (response) => {
        this.users = response.data;
        this.usersService.setUsers(response.data);
      },
      error: (error) => {
        this.toastService.showErrorMessage(error.error.mensaje, `Error ${error.mensaje}`);
      }
    })
  }

  viewUserDetails(userDetails: UsuarioResponse) {
    if(this.modalUserDetails){
      this.modalUserDetails.open(userDetails);
    }
  }


  returnAllRoles(roles: Rol[]) {
    let rolesString = '';
    roles.forEach((role:Rol)=> {
      rolesString += role.nombre + ', ';
    })
    return rolesString.slice(0, -2);
  }

  pageChanged(event: any) {
    this.currentPage = event;
    this.getAllUsers(this.currentPage, this.sizePage);
  }


}
