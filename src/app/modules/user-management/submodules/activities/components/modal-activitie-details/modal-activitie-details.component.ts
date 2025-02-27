import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActividadResponse } from '../../../../../../core/models/response/actividad-response.model';
declare var bootstrap: any;

@Component({
  selector: 'user-management-modal-activitie-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './modal-activitie-details.component.html',
  styleUrl: './modal-activitie-details.component.css'
})
export class ModalActivitieDetailsComponent {
  
  activitieDetails: ActividadResponse | null = null;

  open(activitieDetails: ActividadResponse) {
    const modal = new bootstrap.Modal(document.getElementById('modal-activitie-details'));
    if (modal) {
      modal.show();
      this.activitieDetails = activitieDetails;
    }
  }

}
