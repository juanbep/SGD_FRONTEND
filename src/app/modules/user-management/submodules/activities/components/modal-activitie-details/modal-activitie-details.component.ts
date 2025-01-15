import { Component } from '@angular/core';
import { Activity } from '../../../../../../core/models/activities.interface';
import { CommonModule } from '@angular/common';
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
  
  activitieDetails: Activity | null = null;

  open(activitieDetails: Activity) {
    const modal = new bootstrap.Modal(document.getElementById('modal-activitie-details'));
    if (modal) {
      modal.show();
      this.activitieDetails = activitieDetails;
    }
  }

}
