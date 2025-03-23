import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { AutoevaluacionFuente } from '../../../../../../core/models/modified/autoevaluacion-fuente.model';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import { ActivatedRoute } from '@angular/router';
import { ActividadResponse } from '../../../../../../core/models/response/actividad-response.model';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { PeriodoAcademicoResponse } from '../../../../../../core/models/response/periodo-academico-response.model';
import { AcademicPeriodManagementService } from '../../../../../academic-period-management/services/academic-period-management-service.service';

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
export class SelfEvaluationFormComponent implements OnInit {


  private formBuilder: FormBuilder = inject(FormBuilder);
  private activitiesServicesService = inject(ActivitiesServicesService);
  private validatorsService = inject(ValidatorsService);
  private activatedRoute = inject(ActivatedRoute);
  private messagesInfoService = inject(MessagesInfoService);
  private academicPeriodManagementService = inject(AcademicPeriodManagementService); 
  

  public activityResponse: ActividadResponse | null = null;
  public evaluado: UsuarioResponse | null = null;
  public activityPeriod: PeriodoAcademicoResponse | null = null;

  newSelfEvaluationForm: FormGroup = this.formBuilder.group({
    activityDescription: [null, [Validators.required]],
    results: this.formBuilder.array([ this.createResultEntry() ]),
    lessonsLearned: this.formBuilder.array([ this.createLessonEntry() ]),
    improvementOpportunities: this.formBuilder.array([ this.createOpportunityEntry() ]),
    evaluation: [null, [Validators.required, Validators.min(0), Validators.max(100), this.validatorsService.validateNumericFormat]],
    obseravations: [null, [Validators.required]],
  });


  ngOnInit(): void {
    const idActivity = this.activatedRoute.snapshot.params['id'];
    this.activityPeriod = this.academicPeriodManagementService.currentAcademicPeriodValue;
    this.recoverActivity(idActivity);
  }


  recoverActivity(idActivity: number){
     this.activitiesServicesService.getActivityById(idActivity).subscribe(
      {
        next: (activityResponse: ActividadResponse) => {
          this.activityResponse = activityResponse;
          this.recoverEvaluated(activityResponse.oidEvaluado);
        },
        error: (error: any) => {
          this.messagesInfoService.showErrorMessage(error.error.mensaje, 'Error');
        }
      }
     )
  }

  
  recoverEvaluated(id: number) {
    this.activitiesServicesService.getUserById(id).subscribe({
      next: (user) => {
        this.evaluado = user.data;
      },
      error: (error) => {
        this.messagesInfoService.showErrorMessage(
          error.error.mensaje,
          'Error'
        );
      },
    });
  }



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

  isInvalidField(field: string) {
    const control = this.newSelfEvaluationForm.get(field);
    return (
      control &&
      control.errors &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  getFieldError(field: string): string | null {
    const control = this.newSelfEvaluationForm.get(field);
    const errors = control?.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'min':
          return 'El valor mínimo es 0';
        case 'max':
          return 'El valor máximo es 100';
        case 'invalidNumber':
          return 'El valor debe ser numérico';
        default:
          return null;
      }
    }
    return null;
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
