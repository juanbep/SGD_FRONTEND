import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailService } from '../../services/email.service';
import { MessagesInfoService } from '../../services/messages-info.service';
declare var bootstrap: any;

@Component({
  selector: 'shared-email',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './email.component.html',
  styleUrl: './email.component.css'
})
export class EmailComponent {

  private formBuilder: FormBuilder = inject(FormBuilder);
  private emailService: EmailService = inject(EmailService);
  private messageInfoService: MessagesInfoService = inject(MessagesInfoService);

  public fomrEmail: FormGroup = this.formBuilder.group({
    sender: [,''],
    recipient: [''],
    cc: [''],
    subject: ['',[Validators.required]],
    message: ['',[Validators.required]]
  });

  @Input()
  remitente: string = '';

  @Input()
  destinatario: string = '';
  


  public mensaje: string = '';

  open(mensaje:string){
    const modal= document.getElementById('email-modal');
    if(modal){
      var myModal = new bootstrap.Modal(modal);
      this.mensaje = mensaje;
      this.addDefaultValues();
      myModal.show();
    }
  }

  addDefaultValues(){
    this.fomrEmail.get('sender')?.setValue(this.remitente);
    this.fomrEmail.get('recipient')?.setValue(this.destinatario);
    this.fomrEmail.get('cc')?.setValue('');
    this.fomrEmail.get('message')?.setValue(this.mensaje);
  }

  sendEmail(){
    let emails:string[] = [];
    emails.push(this.remitente);
    emails.push(this.destinatario);
    emails.push(this.fomrEmail.get('cc')?.value);
    this.emailService.sendEmail(emails, this.fomrEmail.get('subject')?.value, this.fomrEmail.get('message')?.value).subscribe(
      {
        next: (response) => {
          this.messageInfoService.showSuccessMessage('Email enviado correctamente', 'Email');
          const modalElement = document.getElementById('email-modal');
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance?.hide();
          }
        },
        error: (error) => {
          this.messageInfoService.showErrorMessage('Error al enviar el email', 'Email');
        }
      }
    )
  }

}
