import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ModalUserDetailslComponent } from '../../../users/components/modal-user-details/modal-user-details.component';
import { ActivitiesManagementService } from '../../services/activities-management.service';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from "../../../../../../shared/components/paginator/paginator.component";
import { RouterModule } from '@angular/router';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { Rol } from '../../../../../../core/models/base/rol.model';
import { ROLES } from '../../../../../../core/enums/domain-enums';


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

  public usersResponse: PagedResponse<UsuarioResponse> | null = null;
  public currentPage: number = 1;
  public sizePage: number = 10;
  
  public filterParams: {nameUser: string | null, identification: string | null, faculty: string | null, program: string | null, rol: string | null, state: string | null} | null = null;

  usersEffect = effect(()=>{
    this.filterParams=this.usersService.getParamsUsersFilter();
    this.currentPage = 1;
    this.getAllUsers(this.currentPage, this.sizePage);
    
  })


  ngOnInit(): void {
    this.usersService.setParamsUsersFilter({nameUser: null, identification: null, faculty: null, program: null, rol: null, state: null});
  }


  getAllUsers(page: number, totalPage: number) {
    const paramsFilter = this.usersService.getParamsUsersFilter();
    this.usersService.getUserByParams(page-1, totalPage, paramsFilter?.identification|| '',paramsFilter?.nameUser || '',paramsFilter?.faculty || '', paramsFilter?.program || '','','','','',ROLES.DOCENTE.toString(), paramsFilter?.state || '' ).subscribe({
      next: (response) => {
        this.usersResponse = response.data;
        this.usersService.setUsers(response.data);
      },
      error: (error) => {
        this.toastService.showErrorMessage('Error al obtener los usuarios', `Error ${error.mensaje}`);
      }
    })
    this.usersService.getUserByParams(page-1, totalPage, paramsFilter?.identification|| '',paramsFilter?.nameUser || '',paramsFilter?.faculty || '', paramsFilter?.program || '','','','','',ROLES.JEFE_DE_DEPARTAMENTO.toString(), paramsFilter?.state || '' ).subscribe({
      next: (response) => {
        this.usersResponse?.content.push(...response.data.content);   
        
        this.usersService.setUsers(response.data);
      },
      error: (error) => {
        this.toastService.showErrorMessage('Error al obtener los usuarios', `Error ${error.mensaje}`);
      }
    })
  }

  viewUserDetails(userDetails: UsuarioResponse) {
    if (this.modalUserDetails) {
      this.modalUserDetails.open(userDetails);
    }
  }


  returnAllRoles(roles: Rol[]) {
    let rolesString = '';
    roles.forEach((role: Rol) => {
      rolesString += role.nombre + ', ';
    })
    return rolesString.slice(0, -2);
  }

  pageChanged(event: any) {
    this.currentPage = event;
    this.getAllUsers(this.currentPage, this.sizePage);
  }
}
