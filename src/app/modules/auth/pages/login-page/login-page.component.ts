import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

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

  authForm: FormGroup = this.formBuilder.group({
    email: [''],
    password: ['']
  });

  /**
   * On login form submit
   */
  onLogin(){
    //TODO: Implement login logic
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
