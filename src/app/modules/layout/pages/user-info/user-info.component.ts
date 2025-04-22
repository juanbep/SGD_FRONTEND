import { Component, inject, OnInit } from '@angular/core';
import { AuthServiceService } from '../../../auth/service/auth-service.service';
import { UsuarioResponse } from '../../../../core/models/response/usuario-response.model';
import { CommonModule } from '@angular/common';
import { Rol } from '../../../../core/models/base/rol.model';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent implements OnInit {
 
  private authServicesService: AuthServiceService = inject(AuthServiceService);

  public currentUser: UsuarioResponse | null = null;

  ngOnInit(): void {
    this.currentUser=this.authServicesService.currentUserValue;
  }
  
  returnAllRoles(roles: Rol[] | null) {
    if(!roles) return '';
    let rolesString = '';
    roles.forEach((role: Rol) => {
      rolesString += role.nombre + ', ';
    })
    return rolesString.slice(0, -2);
  }

}
