// ====================== Importaciones y Constantes ======================
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SelfEvaluationPdfGeneratorService } from '../../services/self-evaluation-pdf-generator.service';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import {
  FuenteAutoevaluacion,
  OdsSeleccionado,
} from '../../../../../../core/models/modified/fuente-autoevaluacion.model';
import { FuenteDocenteFormularioResponse } from '../../../../../../core/models/response/fuente-docente-formulario-response.model';
import { PeriodoAcademicoResponse } from '../../../../../../core/models/response/periodo-academico-response.model';
import { AcademicPeriodManagementService } from '../../../../../academic-period-management/services/academic-period-management-service.service';
import { ConfirmDialogComponent } from '../../../../../../shared/components/confirm-dialog/confirm-dialog.component';

const MESSAGE_TITLE = 'Cancelar';
const MESSAGE_CONFIRM_CANCEL = '¿Está seguro que desea cancelar?';

// ====================== Decorador y Declaración del Componente ======================
@Component({
  selector: 'app-self-evaluation-edit-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ConfirmDialogComponent,
],
  templateUrl: './self-evaluation-edit-form.component.html',
  styleUrls: [],
})
export class SelfEvaluationEditFormComponent implements OnInit {
  // ====================== Inyección de Dependencias ======================
  @ViewChild(ConfirmDialogComponent)
  confirmDialog: ConfirmDialogComponent | null = null;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private activitiesService = inject(ActivitiesServicesService);
  private messagesInfoService = inject(MessagesInfoService);
  private activatedRoute = inject(ActivatedRoute);
  private selfEvaluationPdfGeneratorService = inject(
    SelfEvaluationPdfGeneratorService
  );
  private validatorService = inject(ValidatorsService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private router: Router = inject(Router);
  private academicPeriodManagementService = inject(
    AcademicPeriodManagementService
  );


  // ====================== Propiedades Públicas ======================
  public activityPeriod: PeriodoAcademicoResponse | null = null;
  public pdfUrl: SafeResourceUrl | null = null;
  public formPdf: File | null = null;
  public evidences: File[] = [];
  public signatureFile: File | null = null;
  public fuenteDocenteFormularioResponse: FuenteDocenteFormularioResponse | null =
    null;
  public messageTitle: string = MESSAGE_TITLE;
  public messageConfirmCancel: string = MESSAGE_CONFIRM_CANCEL;
  public ods = [
    { value: 1, label: 'Fin de la pobreza' },
    { value: 2, label: 'Hambre cero' },
    { value: 3, label: 'Salud y bienestar' },
    { value: 4, label: 'Educación de calidad' },
    { value: 5, label: 'Igualdad de género' },
    { value: 6, label: 'Agua limpia y saneamiento' },
    { value: 7, label: 'Energía asequible y no contaminante' },
    { value: 8, label: 'Trabajo decente y crecimiento económico' },
    { value: 9, label: 'Industria, innovación e infraestructura' },
    { value: 10, label: 'Reducción de las desigualdades' },
    { value: 11, label: 'Ciudades y comunidades sostenibles' },
    { value: 12, label: 'Producción y consumo responsables' },
    { value: 13, label: 'Acción por el clima' },
    { value: 14, label: 'Vida submarina' },
    { value: 15, label: 'Vida de ecosistemas terrestres' },
    { value: 16, label: 'Paz, justicia e instituciones sólidas' },
    { value: 17, label: 'Alianzas para lograr los objetivos' },
  ];

  public evidencesFile: {
    name: string;
    file: File;
  }[] = [];

  // ====================== Inicialización del Formulario ======================
  public editSelfEvaluationForm: FormGroup = this.formBuilder.group({
    activityDescription: [null, [Validators.required]],
    results: this.formBuilder.array([this.createResultEntry()]),
    lessonsLearned: this.formBuilder.array([this.createLessonEntry()]),
    improvementOpportunities: this.formBuilder.array([
      this.createOpportunityEntry(),
    ]),
    evaluation: [
      null,
      [Validators.required, Validators.min(0), Validators.max(100)],
    ],
    observation: [null],
    signature: [null, [Validators.required]],
  });

  // ====================== Métodos para Crear Entradas de FormArray ======================
  createResultEntry(): FormGroup {
    return this.formBuilder.group({
      oidResult: [null],
      result: [null, Validators.required],
      ODS: [null, Validators.required],
      evidence: [null],
    });
  }

  createLessonEntry(): FormGroup {
    return this.formBuilder.group({
      oidLesson: [null],
      lesson: [null],
    });
  }

  createOpportunityEntry(): FormGroup {
    return this.formBuilder.group({
      oidOpportunity: [null],
      opportunity: [null],
    });
  }

  // ====================== Getters para los FormArrays ======================
  get results(): FormArray {
    return this.editSelfEvaluationForm.get('results') as FormArray;
  }

  get lessonsLearnedArray(): FormArray {
    return this.editSelfEvaluationForm.get('lessonsLearned') as FormArray;
  }

  get improvementOpportunitiesArray(): FormArray {
    return this.editSelfEvaluationForm.get(
      'improvementOpportunities'
    ) as FormArray;
  }

  // ====================== Métodos de Validación ======================
  isInvalidField(field: string) {
    const control = this.editSelfEvaluationForm.get(field);
    return (
      control &&
      control.errors &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  getFieldError(field: string): string | null {
    const control = this.editSelfEvaluationForm.get(field);
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

  // ====================== Ciclo de Vida del Componente ======================
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.activityPeriod =
      this.academicPeriodManagementService.currentAcademicPeriodValue;
    this.loadSelfEvaluation(id);
  }

  // ====================== Métodos para Cargar Datos (Autoevaluación) ======================
  loadSelfEvaluation(id: number) {
    this.activitiesService.getActivityByIdForm(id).subscribe({
      next: (data) => {
        this.fuenteDocenteFormularioResponse = data.data;
        this.editSelfEvaluationForm.patchValue({
          activityDescription: this.fuenteDocenteFormularioResponse.Descripcion,
          evaluation: Number(
            this.fuenteDocenteFormularioResponse.Fuente.calificacion
          ),
          observation: this.fuenteDocenteFormularioResponse.Fuente.observacion,
        });
        // Manejo del FormArray de resultados
        this.results.clear();
        this.fuenteDocenteFormularioResponse.odsSeleccionados.forEach((ods) => {
          const group = this.createResultEntry();
          group.patchValue({
            oidResult: ods.oidAutoevaluacionOds,
            result: ods.resultado,
            ODS: ods.oidOds,
            evidence: ods.documento || null,
          });
          this.results.push(group);
        });
        this.loadEvidenceFile();
        // Manejo del FormArray de lecciones aprendidas
        this.lessonsLearnedArray.clear();
        if (this.fuenteDocenteFormularioResponse.leccionesAprendidas) {
          this.fuenteDocenteFormularioResponse.leccionesAprendidas.forEach(
            (lesson: any) => {
              const group = this.createLessonEntry();
              group.patchValue({
                lesson: lesson.descripcion,
                oidLesson: lesson.oidLeccionAprendida,
              });
              this.lessonsLearnedArray.push(group);
            }
          );
        }
        // Manejo del FormArray de oportunidades de mejora
        this.improvementOpportunitiesArray.clear();
        if (this.fuenteDocenteFormularioResponse['oportunidadesMejora']) {
          this.fuenteDocenteFormularioResponse['oportunidadesMejora'].forEach(
            (opp: any) => {
              const group = this.createOpportunityEntry();
              group.patchValue({
                opportunity: opp.descripcion,
                oidOpportunity: opp.oidOportunidadMejora,
              });
              this.improvementOpportunitiesArray.push(group);
            }
          );
        }
      },
      error: (error) => {
        this.messagesInfoService.showErrorMessage(error.error.mensaje, 'Error');
      },
    });
  }

  // ====================== Métodos para Manejar Entradas en los FormArrays ======================
  addResultEntry() {
    if (this.results.length < 10) {
      this.results.push(this.createResultEntry());
    }
  }

  removeResultEntry(index: number) {
    this.results.removeAt(index);
  }

  addLessonEntry() {
    if (this.lessonsLearnedArray.length < 10) {
      this.lessonsLearnedArray.push(this.createLessonEntry());
    }
  }

  removeLessonEntry(index: number) {
    this.lessonsLearnedArray.removeAt(index);
  }

  addOpportunityEntry() {
    if (this.improvementOpportunitiesArray.length < 10) {
      this.improvementOpportunitiesArray.push(this.createOpportunityEntry());
    }
  }

  removeOpportunityEntry(index: number) {
    this.improvementOpportunitiesArray.removeAt(index);
  }

  // ====================== Métodos para Manejar Firma y Evidencias ======================
  triggersSignatureUpload() {
    const fileUpload = document.getElementById('signature') as HTMLInputElement;
    if (fileUpload) {
      fileUpload.click();
    }
  }

  onSignatureSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.signatureFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.editSelfEvaluationForm.get('signature')?.setValue(reader.result);
      };
      reader.readAsDataURL(this.signatureFile);
    }
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
      this.editSelfEvaluationForm.get('results.' + index + '.evidence')?.setValue(
        input.files[0].name
      );
    }
  }

  optionDownloadEvidenceFile(index: number) {
    if (
      this.editSelfEvaluationForm.get('results.' + index + '.evidence')?.value

    ) {
      this.downloadEvidenceFileById(index);
    } else {
      if (this.evidences[index]) {
        this.downloadEvidenceFile(index);
      }
    }
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
    this.editSelfEvaluationForm.get('signature')?.setValue(null);
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

  // ====================== Generación del PDF ======================
  generatePdfPreview() {
    const pdfResult =
      this.selfEvaluationPdfGeneratorService.generatePdfDocument(
        this.editSelfEvaluationForm.value,
        {}
      );
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      pdfResult.base64
    );
    this.formPdf = pdfResult.file;
  }

  // ====================== Envío del Formulario ======================
  onSubmit() {
    if (this.editSelfEvaluationForm.invalid) {
      this.editSelfEvaluationForm.markAllAsTouched();
      this.messagesInfoService.showWarningMessage(
        'Complete todos los campos requeridos',
        'Advertencia'
      );
      return;
    }
    const autoevaluacion: FuenteAutoevaluacion = {
      oidFuente: this.activatedRoute.snapshot.params['id'],
      tipoCalificacion: 'EN_LINEA',
      calificacion: Number(
        this.editSelfEvaluationForm.get('evaluation')?.value
      ),
      descripcion: this.editSelfEvaluationForm.get('activityDescription')
        ?.value,
      observacion: this.editSelfEvaluationForm.get('observation')?.value,
      odsSeleccionados: this.editSelfEvaluationForm
        .get('results')
        ?.value.map((result: any) => {
          return {
            oidAutoevaluacionOds: result.oidResult,
            oidOds: Number(result.ODS),
            resultado: result.result,
            documento: result.evidence,
          } as OdsSeleccionado;
        }),
      leccionesAprendidas: this.editSelfEvaluationForm
        .get('lessonsLearned')
        ?.value.map((l: any) => ({
          oidLeccionAprendida: l.oidLesson,
          descripcion: l.lesson,
        })),
      oportunidadesMejora: this.editSelfEvaluationForm
        .get('improvementOpportunities')
        ?.value.map((opp: any) => ({
          oidOportunidadMejora: opp.oidOpportunity,
          descripcion: opp.opportunity,
        })),
    };

    autoevaluacion.odsSeleccionados.forEach((ods, index) => {
      if (this.evidences[index]) {
        ods.documento = this.evidences[index].name;
      }
    });
    this.generatePdfPreview();
    this.activitiesService
      .saveSelfAssessmentByForm(
        autoevaluacion,
        this.evidences,
        this.formPdf!
      )
      .subscribe({
        next: (response) => {
          this.messagesInfoService.showSuccessMessage(
            'Autoevaluación actualizada correctamente',
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

  // ====================== Métodos Adicionales para Evidencias ======================
  loadEvidenceFile() {
    this.fuenteDocenteFormularioResponse?.odsSeleccionados.forEach((ods, index) => {
      if(ods.documento) {
        this.downloadEvidenceFileById(index);
      }
    });
  }

  deleteEvidenceFile(index: number) {
    this.evidences[index] = null as any;
    this.editSelfEvaluationForm.get('results.' + index + '.evidence')
      ? this.editSelfEvaluationForm
          .get('results.' + index + '.evidence')
          ?.setValue(null)
      : null;
  }

  downloadEvidenceFileById(index: number) {
    if (!this.fuenteDocenteFormularioResponse) return;
    this.activitiesService
      .getEvidenceResultOdsFile(
        this.fuenteDocenteFormularioResponse?.odsSeleccionados[index]
          .oidAutoevaluacionOds
      )
      .subscribe({
        next: (response) => {
         this.evidences[index] = new File([response], this.fuenteDocenteFormularioResponse?.odsSeleccionados[index].documento || 'evidencia', {type: 'application/pdf'});
        },
        error: (error) => {
          this.messagesInfoService.showErrorMessage(
            error.error.mensaje,
            'Error'
          );
        },
      });
  }

  // ====================== Navegación y Diálogo de Confirmación ======================
  goBack() {
    if (this.confirmDialog) this.confirmDialog?.open();
  }

  onConfirmCancel(confirm: boolean) {
    if (confirm) this.router.navigate(['./app/gestion-soportes/actividades/']);
  }
}
