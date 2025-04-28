import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActividadResponse } from '../../../../../../core/models/response/actividad-response.model';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { PeriodoAcademicoResponse } from '../../../../../../core/models/response/periodo-academico-response.model';
import { AcademicPeriodManagementService } from '../../../../../academic-period-management/services/academic-period-management-service.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SelfEvaluationPdfGeneratorService } from '../../services/self-evaluation-pdf-generator.service';
import {
  FuenteAutoevaluacion,
  OdsSeleccionado,
} from '../../../../../../core/models/modified/fuente-autoevaluacion.model';
import { ConfirmDialogComponent } from '../../../../../../shared/components/confirm-dialog/confirm-dialog.component';

const MESSAGE_TITLE = 'Cancelar';
const MESSAGE_CONFIRM_CANCEL = '¿Está seguro que desea cancelar?';


@Component({
  selector: 'app-self-evaluation-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ConfirmDialogComponent],
  templateUrl: './self-evaluation-form.component.html',
  styleUrl: './self-evaluation-form.component.css',
})
export class SelfEvaluationFormComponent implements OnInit {
  @ViewChild(ConfirmDialogComponent)
  confirmDialog: ConfirmDialogComponent | null = null;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private activitiesServicesService = inject(ActivitiesServicesService);
  private validatorsService = inject(ValidatorsService);
  private activatedRoute = inject(ActivatedRoute);
  private messagesInfoService = inject(MessagesInfoService);
  private academicPeriodManagementService = inject(
    AcademicPeriodManagementService
  );
  private selfEvaluationPdfGeneratorService = inject(
    SelfEvaluationPdfGeneratorService
  );
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private router: Router = inject(Router);

  public activityResponse: ActividadResponse | null = null;
  public evaluado: UsuarioResponse | null = null;
  public activityPeriod: PeriodoAcademicoResponse | null = null;
  public evidences: File[] = [];
  public pdfUrl: SafeResourceUrl | null = null;
  public formPdf: File | null = null;
  public signatureFile: File | null = null;

  public newSelfEvaluation: FuenteAutoevaluacion | null = null;

  public messageTitle: string = MESSAGE_TITLE;
  public messageConfirmCancel: string = MESSAGE_CONFIRM_CANCEL;

  newSelfEvaluationForm: FormGroup = this.formBuilder.group({
    activityDescription: [null, [Validators.required]],
    results: this.formBuilder.array([this.createResultEntry()]),
    lessonsLearned: this.formBuilder.array([this.createLessonEntry()]),
    improvementOpportunities: this.formBuilder.array([
      this.createOpportunityEntry(),
    ]),
    evaluation: [
      null,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        this.validatorsService.validateNumericFormat,
      ],
    ],
    observation: [null],
    signature: [null, [Validators.required]],
  });

  ngOnInit(): void {
    const idActivity = this.activatedRoute.snapshot.params['id'];
    this.activityPeriod =
      this.academicPeriodManagementService.currentAcademicPeriodValue;
    this.recoverActivity(idActivity);
  }

  recoverActivity(idActivity: number) {
    this.activitiesServicesService.getActivityById(idActivity).subscribe({
      next: (activityResponse: ActividadResponse) => {
        this.activityResponse = activityResponse;
        this.recoverEvaluated(activityResponse.oidEvaluado);
      },
      error: (error: any) => {
        this.messagesInfoService.showErrorMessage(error.error.mensaje, 'Error');
      },
    });
  }

  recoverEvaluated(id: number) {
    this.activitiesServicesService.getUserById(id).subscribe({
      next: (user) => {
        this.evaluado = user.data;
      },
      error: (error) => {
        this.messagesInfoService.showErrorMessage(error.error.mensaje, 'Error');
      },
    });
  }

  // Métodos para resultados existentes...
  createResultEntry(): FormGroup {
    return this.formBuilder.group({
      result: [null, [Validators.required]],
      ODS: [null, [Validators.required]],
      evidence: [null],
    });
  }

  get results(): FormArray {
    return this.newSelfEvaluationForm.get('results') as FormArray;
  }

  onResultsChanged() {
    this.results.valueChanges.subscribe((value) => {
      this.newSelfEvaluation
        ? (this.newSelfEvaluation.odsSeleccionados = value)
        : '';
    });
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
      lesson: [null],
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

  createOpportunityEntry(): FormGroup {
    return this.formBuilder.group({
      opportunity: [null],
    });
  }

  get improvementOpportunitiesArray(): FormArray {
    return this.newSelfEvaluationForm.get(
      'improvementOpportunities'
    ) as FormArray;
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

  triggersEvidences(elementId: string) {
    const fileUpload = document.getElementById(elementId) as HTMLInputElement;
    if (fileUpload) {
      fileUpload.click();
    }
  }

  onEvidenceSelected(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.evidences[index] = input.files[0];
      this.newSelfEvaluation
        ? (this.newSelfEvaluation.odsSeleccionados[index].documento =
            input.files[0].name)
        : '';
    }
  }

  // Método para disparar carga de archivo de firma
  triggersSignatureUpload() {
    const fileUpload = document.getElementById('signature') as HTMLInputElement;
    if (fileUpload) {
      fileUpload.click();
    }
  }

  // Procesa la selección de la firma
  onSignatureSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.signatureFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.newSelfEvaluationForm.get('signature')?.setValue(reader.result);
      };
      reader.readAsDataURL(this.signatureFile);
    }
  }

  // Método para enviar la autoevaluación
  onSubmit() {
    if (this.newSelfEvaluationForm.invalid) {
      this.newSelfEvaluationForm.markAllAsTouched();
      this.messagesInfoService.showWarningMessage(
        'Por favor, complete todos los campos requeridos',
        'Advertencia'
      );
      return;
    }

    // Lógica para enviar la autoevaluación
    const autoevaluacionFuente: FuenteAutoevaluacion = {
      oidFuente: this.activityResponse?.fuentes[0].oidFuente || 0,
      tipoCalificacion: 'EN_LINEA',
      calificacion:
        Number(this.newSelfEvaluationForm.get('evaluation')?.value) || 0,
      descripcion:
        this.newSelfEvaluationForm.get('activityDescription')?.value || '',
      observacion: this.newSelfEvaluationForm.get('observation')?.value || '',
      odsSeleccionados: this.newSelfEvaluationForm
        .get('results')
        ?.value.map((result: any) => {
          const odsSeleccionado: OdsSeleccionado = {
            oidAutoevaluacionOds: null,
            oidOds: Number(result.ODS),
            resultado: result.result,
            documento: '',
          };
          return odsSeleccionado;
        }),
      leccionesAprendidas: this.newSelfEvaluationForm
        .get('lessonsLearned')
        ?.value.map((lesson: any) => {
          return { oidLeccionAprendida: null, descripcion: lesson.lesson };
        }),
      oportunidadesMejora: this.newSelfEvaluationForm
        .get('improvementOpportunities')
        ?.value.map((opportunity: any) => {
          return {
            oidOportunidadMejora: null,
            descripcion: opportunity.opportunity,
          };
        }),
    };
    autoevaluacionFuente.odsSeleccionados.forEach(
      (odsSeleccionado: OdsSeleccionado, index: number) => {
        if (this.evidences[index]) {
          odsSeleccionado.documento = this.evidences[index].name;
        }
      }
    );
    this.generatePdfPreview();
    this.activitiesServicesService
      .saveSelfAssessmentByForm(
        autoevaluacionFuente,
        this.evidences,
        this.formPdf!
      )
      .subscribe({
        next: (response) => {
          this.messagesInfoService.showSuccessMessage(
            'La autoevaluación se ha guardado con éxito',
            'Éxito'
          );
          this.router.navigate(['./app/gestion-soportes/actividades/']);
        },
        error: (error) => {
          this.messagesInfoService.showErrorMessage(
            error.error.mensaje,
            'Error'
          );
        },
      });
  }

  generatePdfPreview() {
    const teacherInfo = this.evaluado || {}; // Se utiliza la información del evaluado
    const pdfResult =
      this.selfEvaluationPdfGeneratorService.generatePdfDocument(
        this.newSelfEvaluationForm.value,
        teacherInfo
      );
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      pdfResult.base64
    );
    this.formPdf = pdfResult.file;
  }

  deleteEvidenceFile(index: number) {
    this.evidences.splice(index, 1);
    this.newSelfEvaluationForm.get('results.' + index + '.evidence')
      ? this.newSelfEvaluationForm
          .get('results.' + index + '.evidence')
          ?.setValue(null)
      : null;
  }

  downloadEvidenceFile(index: number) {
    const evidence = this.evidences[index];
    if (evidence) {
      const url = URL.createObjectURL(evidence);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = evidence.name;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  deleteSignatureFile() {
    this.signatureFile = null;
    this.newSelfEvaluationForm.get('signature')?.setValue(null);
  }

  downloadSignatureFile() {
    const signature = this.signatureFile;
    if (signature) {
      const url = URL.createObjectURL(signature);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = signature.name;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  goBack() {
    if (this.confirmDialog) this.confirmDialog?.open();
  }

  onConfirmCancel(confirm: boolean) {
    if (confirm) this.router.navigate(['./app/gestion-soportes/actividades/']);
  }
}
