import { Component } from '@angular/core';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';

@Component({
  selector: 'app-email-notification',
  standalone: true,
  imports: [],
  templateUrl: './email-notification.component.html',
  styleUrl: './email-notification.component.css'
})
export class EmailNotificationComponent {

  constructor (
    private service: ConsolidatedServicesService,
    private toastr: MessagesInfoService
  ) {}

  
  public recipients:string[] = [];
  public observationInput: string = '';

  observation(event: Event) {
    const observation = (event.target as HTMLInputElement).value;
    this.observationInput = observation.trim().toString();
    console.log(this.observationInput );
  }
  
  selectCheckBox(event: Event){
    const isChecked = (event.target as HTMLInputElement).checked;
    const email = (event.target as HTMLInputElement).value;
    if(isChecked){
      this.recipients.push(email);
    }else{
      const index = this.recipients.indexOf(email);
      if(index > -1){
        this.recipients.splice(index, 1);
      }
    }
    console.log(this.recipients);
  }

  openModal(){
    const myModal = document.getElementById('modal-email-notification-consolidated');
    if(myModal){
      myModal.style.display = 'block';
    }
  }

  closeModal(){
    const myModal = document.getElementById('modal-email-notification-consolidated');
    if(myModal){
      myModal.style.display = 'none';
    }
  }

  sendEmail(){
    this.service.sendEmail(this.recipients, this.observationInput).subscribe(
      {
        next: () => {
          this.toastr.showSuccessMessage('Correo enviado exitosamente', 'Email sent');
          this.closeModal();
        },
        error: () => {
          this.toastr.showErrorMessage('Error al enviar el correo', 'Error');
        }
      }
    );
  }
}
