import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { Rol } from '../../../../../../core/models/base/rol.model';
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

  userDetails: UsuarioResponse | null = null;

  open(userDetails: UsuarioResponse) {
    const modal = new bootstrap.Modal(document.getElementById('modal-user-details'));
    if (modal) {
      modal.show();
      this.userDetails = userDetails;
    }
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
