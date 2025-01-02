import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../service/auth-service.service';
import { ValidatorsService } from '../../../../shared/services/validators.service';

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  private formBuilder: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private service: AuthServiceService = inject(AuthServiceService);
  private validatorsServices: ValidatorsService = inject(ValidatorsService);

  authForm: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.pattern(this.validatorsServices.emailPattern)]],
    password: [null, [Validators.required]]
  });

  /**
   * On login form submit
   */
  onLogin() {
    this.service.login(this.authForm.value.email, this.authForm.value.password);
    this.service.getUserInfo(6).subscribe((data) => {
      console.log(data);
    });
    this.router.navigate(['/app']);
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
      console.log('key'+key);
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
