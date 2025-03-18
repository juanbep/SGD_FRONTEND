import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import { of } from 'rxjs';
import { ResponsibilityWordGeneratorService } from '../../services/responsibility-word-generator.service';
import { ResponsibilityPdfGeneratorService } from '../../services/responsibility-pdf-generator.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponsibilitiesServicesService } from '../../services/responsibilities-services.service';
import { ActividadResponse } from '../../../../../../core/models/response/actividad-response.model';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { ConfirmDialogComponent } from '../../../../../../shared/components/confirm-dialog/confirm-dialog.component';

const MESSAGE_TITLE = 'Cancelar';
const MESSAGE_CONFIRM_CANCEL = '¿Está seguro que desea cancelar?';


@Component({
  selector: 'app-responsabilitie-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './responsabilitie-student-form.component.html',
  styleUrl: './responsabilitie-student-form.component.css',
})
export class ResponsabilitieStudentFormComponent implements OnInit {

  @ViewChild(ConfirmDialogComponent)
  confirmDialog: ConfirmDialogComponent | null = null;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private validatorsService: ValidatorsService = inject(ValidatorsService);
  private responsibilitiesServicesService = inject(
    ResponsibilitiesServicesService
  );
  private responsibilityWordGeneratorService: ResponsibilityWordGeneratorService =
    inject(ResponsibilityWordGeneratorService);
  private responsibilityPdfGeneratorService: ResponsibilityPdfGeneratorService =
    inject(ResponsibilityPdfGeneratorService);
  private activatedRoute = inject(ActivatedRoute);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private menssagesInfoService = inject(MessagesInfoService);
  private router = inject(Router);

  public totalAverage: number | null = null;
  public allCompleted: boolean = false;
  public errorCalification: boolean = false;
  public pdfUrl: SafeResourceUrl | null = null;
  public responsibility: ActividadResponse | null = null;
  public evaluado: UsuarioResponse | null = null;
  public evaluador: UsuarioResponse | null = null;
  public currentDate = new Date();

  public messageTitle: string = MESSAGE_TITLE;
	public messageConfirmCancel: string = MESSAGE_CONFIRM_CANCEL;


  formEvaluation: FormGroup = this.formBuilder.group({
    degreeWorkTitle: [null, [Validators.required]],
    developmentStage: [null, [Validators.required]],
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
    observations: [''],
    studentSignature: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.isQuilificationChanged();
    const id = this.activatedRoute.snapshot.params['id'];
    this.recoverResponsibility(id);
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
            this.menssagesInfoService.showErrorMessage(
              error.error.mensaje,
              'Error'
            );
          },
        });
    }
  }

  recoverUser(id: number, userRecovered: UsuarioResponse | null) {
    this.responsibilitiesServicesService.getUserById(id).subscribe({
      next: (user) => {
        userRecovered = user.data;
      },
      error: (error) => {
        this.menssagesInfoService.showErrorMessage(
          error.error.mensaje,
          'Error'
        );
      },
    });
  }

  recoverEvaluated(id: number) {
    this.responsibilitiesServicesService.getUserById(id).subscribe({
      next: (user) => {
        this.evaluado = user.data;
      },
      error: (error) => {
        this.menssagesInfoService.showErrorMessage(
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
        this.menssagesInfoService.showErrorMessage(
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
    if (evaluationNumber >= 90 && evaluationNumber <= 100) {
      return 'Sobresaliente';
    }
    return '';
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
        default:
          return null;
      }
    }
    return null;
  }

  triggersSignatureFileUpload() {
    const fileUpload = document.getElementById(
      'studentSignature'
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
      reader.onload = () => {
        const base64String = reader.result?.toString() || '';
        this.formEvaluation.get('studentSignature')?.setValue(base64String);

        console.log(base64String);
      };
      reader.readAsDataURL(file);
    }
  }

  deleteFile() {
    this.formEvaluation.get('studentSignature')?.setValue(null);
  }

  downloadFile() {
    const file = this.formEvaluation.get('studentSignature')?.value;
    if (file) {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
    }
  }

  downloadWordDocument() {
    const studentInfo = {
      name: 'Pepito',
      id: '123456789',
      department: 'Departamento',
      directorName: 'Fulanita',
      evaluationDate: '01/02/2023',
      totalAverage: this.totalAverage,
    };

    this.responsibilityWordGeneratorService.generateWordDocument(
      this.formEvaluation.value,
      studentInfo
    );
  }

  async generatePdfPreview() {
    const studentInfo = {
      name: this.evaluador?.nombres + ' ' + this.evaluador?.apellidos,
      id: this.evaluado?.identificacion,
      department: this.evaluado?.usuarioDetalle.departamento,
      directorName: this.evaluado?.nombres + ' ' + this.evaluado?.apellidos,
      evaluationDate: this.currentDate.toLocaleDateString(),
      totalAverage: this.totalAverage,
    };

    const pdfBase64 =
      await this.responsibilityPdfGeneratorService.generatePdfDocument(
        this.formEvaluation.value,
        studentInfo
      );
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfBase64);
  }

  saveEvaluation() {
    if (this.formEvaluation.invalid) {
      this.formEvaluation.markAllAsTouched();
      this.menssagesInfoService.showWarningMessage(
        'Por favor complete todos los campos',
        'Advertencia'
      );
      return;
    }
  }

  goBack() {
    if(this.confirmDialog) this.confirmDialog?.open();
  }

  onConfirmCancel(confirm: boolean) {
    if (confirm)
    this.router.navigate(['./app/gestion-soportes/responsabilidades/']);
  }
}
