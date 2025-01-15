import { Component, inject } from '@angular/core';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { EmailService } from '../../../../../../shared/services/email.service';

@Component({
  selector: 'app-email-notification',
  standalone: true,
  imports: [],
  templateUrl: './email-notification.component.html',
  styleUrl: './email-notification.component.css'
})
export class EmailNotificationComponent {

  private emailService: EmailService = inject(EmailService);
  private service: ConsolidatedServicesService = inject(ConsolidatedServicesService);
  private toastr: MessagesInfoService = inject(MessagesInfoService);

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
    this.emailService.sendEmail(this.recipients, 'Observación actividad',this.observationInput).subscribe(
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
