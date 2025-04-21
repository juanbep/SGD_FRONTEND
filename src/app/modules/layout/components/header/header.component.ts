import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../auth/service/auth-service.service';
import { CommonModule } from '@angular/common';
import { UsuarioResponse } from '../../../../core/models/response/usuario-response.model';
import { Rol } from '../../../../core/models/base/rol.model';

@Component({
  selector: 'layout-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  private router: Router = inject(Router);
  private authServiceService = inject(AuthServiceService);

  public currentUser: UsuarioResponse | null = null;

  ngOnInit(): void {
    this.currentUser = this.authServiceService.currentUserValue;
  }

  logOut() {
    this.authServiceService.logout();
  }

  returnAllRoles(roles: Rol[]) {
    let rolesString = '';
    roles.forEach((role: Rol) => {
      rolesString += role.nombre + ', ';
    })
    return rolesString.slice(0, -2);
  }
}
