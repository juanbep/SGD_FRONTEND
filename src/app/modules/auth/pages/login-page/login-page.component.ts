import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../service/auth-service.service';
import { ValidatorsService } from '../../../../shared/services/validators.service';
import { MessagesInfoService } from '../../../../shared/services/messages-info.service';
import { ButtonProvidersComponent } from "../../component/button-providers/button-providers.component";
import { take } from 'rxjs';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonProvidersComponent,
],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit{
  

  private formBuilder: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private authServicesService: AuthServiceService = inject(AuthServiceService);
  private validatorsServices: ValidatorsService = inject(ValidatorsService);
  private messagesInfoService: MessagesInfoService = inject(MessagesInfoService);

  authForm: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.pattern(this.validatorsServices.emailPattern)]],
    password: [null, [Validators.required]]
  });

  /**
   * On login form submit
   */
  onLogin() {
    // let idCurrentUser = this.service.login(this.authForm.value.email, this.authForm.value.password);
    // if(idCurrentUser) {
    //   this.messagesInfoService.showSuccessMessage('Bienvenido', 'Éxito');
    //   this.router.navigate(['/app/home']);
    // }
    // else {
    //   this.messagesInfoService.showErrorMessage('Usuario o contraseña incorrectos', 'Error');
    // }
  }

  ngOnInit(): void {
    this.authServicesService.loginSuccess$.pipe(take(1)).subscribe(() => {
      this.messagesInfoService.showSuccessMessage('Bienvenido', 'Éxito');
      this.router.navigate(['/app/home']);
    });

    this.authServicesService.logoutSuccess$.pipe(take(1)).subscribe(() => {
      this.messagesInfoService.showSuccessMessage('Hasta luego', 'Éxito');
      this.router.navigate(['/auth/login']);
    });

  }

  async onLoginGoogle(login: boolean) {
    if (!login) return;
    await this.authServicesService.loginWithGooglePopPup();
    
  }



  /**
   * Check if the field is valid
   */
  isValidField(field: string) {
    const control = this.authForm.controls[field];
    if (control.invalid && (control.dirty || control.touched)) {
      return true;
    }
    return false;
  }

  /**
   * Get field error
   */
  getFieldError(field: string) {
    //TODO: Implement validation logic
    const control = this.authForm.controls[field];
    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Campo requerido';
        case 'pattern':
          return 'Formato inválido';
        default:
          return key;
      }

    }
    return null;
  }








}
