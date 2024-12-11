import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../service/auth-service.service';

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

  authForm: FormGroup = this.formBuilder.group({
    email: [''],
    password: ['']
  });

  /**
   * On login form submit
   */
  onLogin(){
    this.service.login(this.authForm.value.email, this.authForm.value.password);
    this.service.getUserInfo(6).subscribe((data) => {
      console.log(data);
    });
    this.router.navigate(['/app']);
  }


  /**
   * Check if the field is valid
   */
  isValidField(field:string){
    //TODO: Implement validation logic
    return true;
  }

  /**
   * Get field error
   */
  getFieldError(field:string){
    //TODO: Implement validation logic
    return true;
  }






  


}
