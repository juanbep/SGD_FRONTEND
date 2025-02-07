import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-self-evaluation-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './self-evaluation-form.component.html',
  styleUrl: './self-evaluation-form.component.css'
})
export class SelfEvaluationFormComponent {

  private formBuilder: FormBuilder = inject(FormBuilder);


  newSelfEvaluationForm: FormGroup = this.formBuilder.group({
    activityDescription: [null,[Validators.required]],
    resultd: [null,[Validators.required]],
    ODS: [null,[Validators.required]],
    evidence: [null,[Validators.required]],
    lessonsLearned: [null,[Validators.required]],
    improvementOpportunities: [null,[Validators.required]],
    evaluation: [null,[Validators.required]],
    obseravations: [null,[Validators.required]],
  });


  


  

}
