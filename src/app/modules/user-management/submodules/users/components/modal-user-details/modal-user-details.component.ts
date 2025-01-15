import { Component, Inject, Input } from '@angular/core';
import { UsersServiceService } from '../../services/users-service.service';
import { Role, User } from '../../../../../../core/models/users.interfaces';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'users-management-users-modal-user-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './modal-user-details.component.html',
  styleUrl: './modal-user-details.component.css'
})
export class ModalUserDetailslComponent {

  userDetails: User | null = null;

  open(userDetails: User) {
    const modal = new bootstrap.Modal(document.getElementById('modal-user-details'));
    if (modal) {
      modal.show();
      this.userDetails = userDetails;
    }
  }


  returnAllRoles(roles: Role[] | null) {
    if(!roles) return '';
    let rolesString = '';
    roles.forEach((role: Role) => {
      rolesString += role.nombre + ', ';
    })
    return rolesString.slice(0, -2);
  }
}
