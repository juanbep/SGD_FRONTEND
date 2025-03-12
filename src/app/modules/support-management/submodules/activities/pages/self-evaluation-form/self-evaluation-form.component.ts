import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { AutoevaluacionFuente } from '../../../../../../core/models/modified/autoevaluacion-fuente.model';

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
  private activitiesServicesService = inject(ActivitiesServicesService);

  newSelfEvaluationForm: FormGroup = this.formBuilder.group({
    activityDescription: [null, [Validators.required]],
    results: this.formBuilder.array([ this.createResultEntry() ]),
    lessonsLearned: this.formBuilder.array([ this.createLessonEntry() ]),
    improvementOpportunities: this.formBuilder.array([ this.createOpportunityEntry() ]),
    evaluation: [null, [Validators.required]],
    obseravations: [null, [Validators.required]],
  });

  // Métodos para resultados existentes...
  createResultEntry(): FormGroup {
    return this.formBuilder.group({
      result: [null, [Validators.required]],
      ODS: [null, [Validators.required]],
      evidence: [null, [Validators.required]],
    });
  }

  get results(): FormArray {
    return this.newSelfEvaluationForm.get('results') as FormArray;
  }

  addResultEntry() {
    if (this.results.length < 10) {
      this.results.push(this.createResultEntry());
    }
  }

  removeResultEntry(index: number) {
    this.results.removeAt(index);
  }

  // Nuevos métodos para lecciones aprendidas
  createLessonEntry(): FormGroup {
    return this.formBuilder.group({
      lesson: [null, [Validators.required]]
    });
  }

  get lessonsLearnedArray(): FormArray {
    return this.newSelfEvaluationForm.get('lessonsLearned') as FormArray;
  }

  addLessonEntry() {
    if (this.lessonsLearnedArray.length < 10) {
      this.lessonsLearnedArray.push(this.createLessonEntry());
    }
  }

  removeLessonEntry(index: number) {
    this.lessonsLearnedArray.removeAt(index);
  }

  // Nuevos métodos para oportunidades de mejora
  createOpportunityEntry(): FormGroup {
    return this.formBuilder.group({
      opportunity: [null, [Validators.required]]
    });
  }

  get improvementOpportunitiesArray(): FormArray {
    return this.newSelfEvaluationForm.get('improvementOpportunities') as FormArray;
  }

  addOpportunityEntry() {
    if (this.improvementOpportunitiesArray.length < 10) {
      this.improvementOpportunitiesArray.push(this.createOpportunityEntry());
    }
  }

  removeOpportunityEntry(index: number) {
    this.improvementOpportunitiesArray.removeAt(index);
  }


  // Método para enviar la autoevaluación
  onSubmit() {
    // Lógica para enviar la autoevaluación
    if(this.newSelfEvaluationForm){
      const autoevaluacionFuente: AutoevaluacionFuente = {
        descripcionActividad: this.newSelfEvaluationForm.get('activityDescription')!.value,
        resultados: this.newSelfEvaluationForm.get('results')?.value.map((result: any) => {
          return {
            resultado: result.result,
            ODS: result.ODS,
            evidencia: result.evidence
          };
        }),
        leccionesAprendidas: this.newSelfEvaluationForm.get('lessonsLearned')?.value.map((lesson: any) => {
          return {
            leccion: lesson.lesson
          };
        }),
        oportunidadesMejora: this.newSelfEvaluationForm.get('improvementOpportunities')?.value.map((opportunity: any) => {
          return {
            oportunidad: opportunity.opportunity
          }
        }),
        evaluacion: this.newSelfEvaluationForm.get('evaluation')!.value,
        observaciones: this.newSelfEvaluationForm.get('observations')? this.newSelfEvaluationForm.get('observations')!.value : null
      };
      console.log(autoevaluacionFuente);
      this.activitiesServicesService.saveSelfAssessmentByForm(autoevaluacionFuente);
    }
      
  }
}
