import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../auth/service/auth-service.service';
import { UserInfo } from '../../../../core/models/auth.interface';
import { CommonModule } from '@angular/common';
import { Role } from '../../../../core/models/auth.interface';

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

  public currentUser: UserInfo | null = null;

  ngOnInit(): void {
    this.currentUser = this.authServiceService.currentUserValue;
  }

  logOut() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }

  returnAllRoles(roles: Role[]) {
    let rolesString = '';
    roles.forEach((role: Role) => {
      rolesString += role.nombre + ', ';
    })
    return rolesString.slice(0, -2);
  }
}
