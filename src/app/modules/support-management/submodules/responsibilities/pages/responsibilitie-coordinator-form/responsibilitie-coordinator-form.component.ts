import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import { ResponsibilityCoordinatorPdfGeneratorService } from '../../services/responsibility-coordinator-pdf-generator.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { ResponsibilitiesServicesService } from '../../services/responsibilities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ActividadResponse } from '../../../../../../core/models/response/actividad-response.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PeriodoAcademicoResponse } from '../../../../../../core/models/response/periodo-academico-response.model';
import { AcademicPeriodManagementService } from '../../../../../academic-period-management/services/academic-period-management-service.service';
import { FuenteCoordinadorFormulario } from '../../../../../../core/models/modified/fuente-coordinador-formulario.model';
import { LoadingOverleyComponent } from "../../../../../../shared/components/loading-overley/loading-overley.component";
import { ConfirmDialogComponent } from "../../../../../../shared/components/confirm-dialog/confirm-dialog.component";


const MESSAGE_TITLE = 'Cancelar';
const MESSAGE_CONFIRM_CANCEL = '¿Está seguro que desea cancelar?';

@Component({
  selector: 'app-responsibilitie-coordinator-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingOverleyComponent, ConfirmDialogComponent],
  templateUrl: './responsibilitie-coordinator-form.component.html',
  styleUrl: './responsibilitie-coordinator-form.component.css',
})
export class ResponsibilitieCoordinatorFormComponent implements OnInit {

  @ViewChild(ConfirmDialogComponent)
    confirmDialog: ConfirmDialogComponent | null = null;
  

  private formBuilder: FormBuilder = inject(FormBuilder);
  private validatorsService: ValidatorsService = inject(ValidatorsService);
  private responsibilitiesServicesService = inject(
    ResponsibilitiesServicesService
  );

  private responsibilityCoordinatorPdfGeneratorService = inject(
    ResponsibilityCoordinatorPdfGeneratorService
  );

  private messagesInfoService = inject(MessagesInfoService);

  private activatedRoute = inject(ActivatedRoute);

  private academicPeriodManagementService = inject(
    AcademicPeriodManagementService
  );

  private router = inject(Router);

  public evaluador: UsuarioResponse | null = null;
  public evaluado: UsuarioResponse | null = null;
  public responsibility: ActividadResponse | null = null;

  public isLoading: boolean = false;

  public totalAverage: number | null = null;
  public errorCalification: boolean = false;
  public allCompleted: boolean = false;

  public currentDate = new Date();


  public pdfUrl: SafeResourceUrl | null = null;
  public formPdf: File | null = null;
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  public activityPeriod: PeriodoAcademicoResponse | null = null;

  public messageTitle: string = MESSAGE_TITLE;
  public messageConfirmCancel: string = MESSAGE_CONFIRM_CANCEL;

  public selectedFiles: {
    signature: File | null;
    reportDocument: File | null;
  } = { signature: null, reportDocument: null };

  formEvaluation: FormGroup = this.formBuilder.group({
    qualification_1: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(this.validatorsService.numericPattern),
      ],
    ],
    qualification_2: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(this.validatorsService.numericPattern),
      ],
    ],
    qualification_3: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(this.validatorsService.numericPattern),
      ],
    ],
    qualification_4: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(this.validatorsService.numericPattern),
      ],
    ],
    qualification_5: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(this.validatorsService.numericPattern),
      ],
    ],
    qualification_6: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(this.validatorsService.numericPattern),
      ],
    ],
    qualification_7: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(this.validatorsService.numericPattern),
      ],
    ],
    qualification_8: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(this.validatorsService.numericPattern),
      ],
    ],
    qualification_9: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(this.validatorsService.numericPattern),
      ],
    ],
    qualification_10: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(this.validatorsService.numericPattern),
      ],
    ],
    qualification_11: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(this.validatorsService.numericPattern),
      ],
    ],
    qualification_12: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(this.validatorsService.numericPattern),
      ],
    ],
    qualification_13: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(this.validatorsService.numericPattern),
      ],
    ],
    qualification_14: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(this.validatorsService.numericPattern),
      ],
    ],
    qualification_15: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern(this.validatorsService.numericPattern),
      ],
    ],
    observations: [''],
    userSignature: ['', [Validators.required]],
  });

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.activityPeriod =
      this.academicPeriodManagementService.currentAcademicPeriodValue;
    this.isQuilificationChanged();
    this.recoverResponsibility(id);
    this.aplyFileTypeValidator();
  }

  aplyFileTypeValidator() {
    this.formEvaluation.get('userSignature')?.setValidators([
      Validators.required,
      this.fileTypeValidator(['png']),
    ]);
    this.formEvaluation.get('userSignature')?.updateValueAndValidity();
  }

  fileTypeValidator(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (file && file.name) {
        const fileType = file.name.split('.').pop()?.toLowerCase();
        if (!allowedTypes.includes(fileType || '')) {
          return { invalidFileType: true };
        }
      }
      return null;
    };
  }

  isInvalidField(field: string) {
    const control = this.formEvaluation.get(field);
    return (
      control &&
      control.errors &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  getFieldError(field: string): string | null {
    if (!this.formEvaluation.controls[field]) return null;
    const control = this.formEvaluation.controls[field];
    const errors = control.errors || {};
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
        case 'invalidFileType':
          return 'El archivo debe ser de tipo .png';
        default:
          return null;
      }
    }
    return null;
  }

  recoverResponsibility(id: number) {
    if (id) {
      this.responsibilitiesServicesService
        .getResponsibilitieById(id)
        .subscribe({
          next: (responsibility) => {
            this.responsibility = responsibility;
            this.recoverEvaluated(responsibility.oidEvaluado);
            this.recoverEvualator(responsibility.oidEvaluador);
          },
          error: (error) => {
            this.messagesInfoService.showErrorMessage(
              error.error.mensaje,
              'Error'
            );
          },
        });
    }
  }

  recoverEvaluated(id: number) {
    this.responsibilitiesServicesService.getUserById(id).subscribe({
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

  recoverEvualator(id: number) {
    this.responsibilitiesServicesService.getUserById(id).subscribe({
      next: (user) => {
        this.evaluador = user.data;
      },
      error: (error) => {
        this.messagesInfoService.showErrorMessage(
          error.error.mensaje,
          'Error'
        );
      },
    });
  }

  isQuilificationChanged() {
    const fields = [
      'qualification_1',
      'qualification_2',
      'qualification_3',
      'qualification_4',
      'qualification_5',
      'qualification_6',
      'qualification_7',
      'qualification_8',
      'qualification_9',
      'qualification_10',
      'qualification_11',
      'qualification_12',
      'qualification_13',
      'qualification_14',
      'qualification_15',
    ];
    fields.map((field) =>
      this.formEvaluation.get(field)?.valueChanges.subscribe(() => {
        const { allCompleted, average } = this.checkEvaluationsAndGetAverage();
        this.allCompleted = allCompleted;
        this.totalAverage = average;
      })
    );
  }

  checkEvaluationsAndGetAverage(): {
    allCompleted: boolean;
    average: number | null;
  } {
    const fields = [
      'qualification_1',
      'qualification_2',
      'qualification_3',
      'qualification_4',
      'qualification_5',
      'qualification_6',
      'qualification_7',
      'qualification_8',
      'qualification_9',
      'qualification_10',
      'qualification_11',
      'qualification_12',
      'qualification_13',
      'qualification_14',
      'qualification_15',
    ];
    const values = fields.map((field) => this.formEvaluation.get(field)?.value);
    const allCompleted = values.every((val) => val !== '');
    if (!allCompleted) {
      return { allCompleted, average: null };
    }

    for (let field of fields) {
      if (this.isInvalidField(field)) {
        this.errorCalification = true;
        break;
      }
      this.errorCalification = false;
    }

    const sum = values.reduce((acc, val) => acc + Number(val), 0);

    return { allCompleted, average: sum / values.length };
  }

  triggersSignatureFileUpload() {
    const fileUpload = document.getElementById(
      'userSignature'
    ) as HTMLInputElement;
    if (fileUpload) {
      fileUpload.click();
    }
  }

  onSignatureFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      this.selectedFiles.signature = file;
      reader.onload = () => {
        this.formEvaluation.get('userSignature')?.setValue(file);
      };
      reader.readAsDataURL(file);
    }
  }

  deleteFile() {
    this.formEvaluation.get('userSignature')?.setValue(null);
  }

  downloadFile() {
    const file = this.selectedFiles.signature;
    if (file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
    }
  }

  async generatePdfPreview() {
    const userInfo = {
      nameEvaluator: this.evaluador?.nombres + ' ' + this.evaluador?.apellidos,
      id: this.evaluado?.identificacion,
      department: this.evaluado?.usuarioDetalle.departamento,
      teacherName: this.evaluado?.nombres + ' ' + this.evaluado?.apellidos,
      evaluationDate: this.currentDate.toLocaleDateString(),
      totalAverage: this.totalAverage,
      period: this.activityPeriod?.idPeriodo,
      activityName: this.responsibility?.nombreActividad
      ,
    };

    const pdfBase64 =
      this.responsibilityCoordinatorPdfGeneratorService.generatePdfDocument(
        this.formEvaluation.value,
        userInfo
      );
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      (await pdfBase64).base64
    );
    this.formPdf = (await pdfBase64).file;

    this.selectedFiles.reportDocument = this.formPdf;
  }


  qualitativeEquivalent(evaluation: string | null) {
    if (evaluation === null || evaluation === '') {
      return '';
    }
    const evaluationNumber = Number(evaluation);
    if (evaluationNumber >= 0 && evaluationNumber < 70) {
      return 'Deficiente';
    }
    if (evaluationNumber >= 70 && evaluationNumber < 80) {
      return 'Aceptable';
    }
    if (evaluationNumber >= 80 && evaluationNumber < 90) {
      return 'Bueno';
    }
    if (evaluationNumber >= 90 && evaluationNumber < 95) {
      return 'Sobresaliente';
    }
    if (evaluationNumber >= 95 && evaluationNumber <= 100) {
      return 'Excelente';
    }
    return '';
  }

  saveEvaluation() {
    if (this.formEvaluation.invalid) {
      this.formEvaluation.markAllAsTouched();
      this.messagesInfoService.showWarningMessage(
        'Por favor complete todos los campos',
        'Advertencia'
      );
      return;
    }

    this.isLoading = true;

    this.generatePdfPreview();
    const fuenteCoordinadorFormulario: FuenteCoordinadorFormulario = {
      oidFuente: this.responsibility?.fuentes[1].oidFuente || 0,
      tipoCalificacion: 'EN_LINEA',
      observacion: this.formEvaluation.get('observations')?.value || '',
      calificacion: this.totalAverage || 0,
      informesAdministracion: [
        {
          oidObjetivoComponente: 1,
          calificacion: Number(this.formEvaluation.get('qualification_1')?.value),
        },
        {
          oidObjetivoComponente: 2,
          calificacion: Number(this.formEvaluation.get('qualification_2')?.value),
        },
        {
          oidObjetivoComponente: 3,
          calificacion: Number(this.formEvaluation.get('qualification_3')?.value),
        },
        {
          oidObjetivoComponente: 4,
          calificacion: Number(this.formEvaluation.get('qualification_4')?.value),
        },
        {
          oidObjetivoComponente: 5,
          calificacion: Number(this.formEvaluation.get('qualification_5')?.value),
        },
        {
          oidObjetivoComponente: 6,
          calificacion: Number(this.formEvaluation.get('qualification_6')?.value),
        },
        {
          oidObjetivoComponente: 7,
          calificacion: Number(this.formEvaluation.get('qualification_7')?.value),
        },
        {
          oidObjetivoComponente: 8,
          calificacion: Number(this.formEvaluation.get('qualification_8')?.value),
        },
        {
          oidObjetivoComponente: 9,
          calificacion: Number(this.formEvaluation.get('qualification_9')?.value),
        },
        {
          oidObjetivoComponente: 10,
          calificacion: Number(this.formEvaluation.get('qualification_10')?.value),
        },
        {
          oidObjetivoComponente: 11,
          calificacion: Number(this.formEvaluation.get('qualification_11')?.value),
        },
        {
          oidObjetivoComponente: 12,
          calificacion: Number(this.formEvaluation.get('qualification_12')?.value),
        },
        {
          oidObjetivoComponente: 13,
          calificacion: Number(this.formEvaluation.get('qualification_13')?.value),
        },
        {
          oidObjetivoComponente: 14,
          calificacion: Number(this.formEvaluation.get('qualification_14')?.value),
        },
        {
          oidObjetivoComponente: 15,
          calificacion: Number(this.formEvaluation.get('qualification_15')?.value),
        },
      ],
    };

    this.responsibilitiesServicesService
      .saveResponibilityFormCoordinador(
        fuenteCoordinadorFormulario,
        this.selectedFiles.reportDocument || new File([], ''),
      )
      .subscribe({
        next: (response) => {
          this.messagesInfoService.showSuccessMessage(
            'Evaluación guardada correctamente',
            'Éxito'
          );
          this.isLoading = false;
          this.router.navigate(['./app/gestion-soportes/responsabilidades/']);
        },
        error: (error) => {
          this.isLoading = false;
          this.messagesInfoService.showErrorMessage(
            error.error.mensaje,
            'Error'
          );
        },
      });
  }
  goBack() {
    if (this.confirmDialog) this.confirmDialog?.open();
  }

  onConfirmCancel(confirm: boolean) {
    if (confirm)
      this.router.navigate(['./app/gestion-soportes/responsabilidades/']);
  }

}
