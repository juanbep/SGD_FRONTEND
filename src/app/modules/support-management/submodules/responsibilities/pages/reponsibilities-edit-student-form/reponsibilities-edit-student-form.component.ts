import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponsibilitiesServicesService } from '../../services/responsibilities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ConfirmDialogComponent } from '../../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FuenteEstudianteFormularioResponse } from '../../../../../../core/models/response/fuente-estudiante-formulario-response.model';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { ResponsibilityPdfGeneratorService } from '../../services/responsibility-pdf-generator.service';
import { FuenteEstudianteFormulario } from '../../../../../../core/models/modified/fuente-estudiante-formulario.model';
import { LoadingOverleyComponent } from "../../../../../../shared/components/loading-overley/loading-overley.component";

const MESSAGE_TITLE = 'Cancelar';
const MESSAGE_CONFIRM_CANCEL = '¿Está seguro que desea cancelar?';

@Component({
  selector: 'reponsibilities-edit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent, LoadingOverleyComponent],
  templateUrl: './reponsibilities-edit-student-form.component.html',
  styleUrls: ['./reponsibilities-edit-student-form.component.css'],
})
export class ReponsibilitiesEditStudentFormComponent implements OnInit {
  @ViewChild(ConfirmDialogComponent)
  confirmDialog: ConfirmDialogComponent | null = null;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  private activatedRoute = inject(ActivatedRoute);
  private responsibilitiesService = inject(ResponsibilitiesServicesService);
  private messagesInfoService = inject(MessagesInfoService);
  private router = inject(Router);
  private catologDataService = inject(CatalogDataService);
  private responsibilityPdfGeneratorService: ResponsibilityPdfGeneratorService =
    inject(ResponsibilityPdfGeneratorService);

  public catalogDataResponse: CatalogDataResponse | null = null;

  public messageTitle: string = MESSAGE_TITLE;
  public messageConfirmCancel: string = MESSAGE_CONFIRM_CANCEL;
  public pdfUrl: SafeResourceUrl | null = null;
  public evaluado: UsuarioResponse | null = null;
  public evaluador: UsuarioResponse | null = null;
  public currentDate = new Date();
  public formPdf: File | null = null;
  public isLoading: boolean = false;


  public selectedFiles: {
    signature: File | null;
    reportDocument: File | null;
  } = { signature: null, reportDocument: null };

  formEvaluation: FormGroup = this.formBuilder.group({
    degreeWorkTitle: [null, [Validators.required]],
    developmentStage: [null, [Validators.required]],
    qualification_1: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
    qualification_2: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
    qualification_3: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
    qualification_4: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
    qualification_5: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
    qualification_6: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
    qualification_7: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
    qualification_8: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
    observations: [''],
    studentSignature: ['', [Validators.required]],
  });

  public responsibility: FuenteEstudianteFormularioResponse | null = null;
  public totalAverage: number | null = null;
  public errorCalification: boolean = false;
  public allCompleted: boolean = false;

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.catalogDataResponse = this.catologDataService.catalogDataSignal;
    this.loadResponsibility(id);
    this.onQualificationChanges();
  }

  loadResponsibility(id: number) {
    if (id) {
      this.responsibilitiesService.getInfoResponsibilityByForm(id).subscribe({
        next: (resp) => {
          this.responsibility = resp.data;
          this.patchForm();
        },
        error: (err) => {
          this.messagesInfoService.showErrorMessage(err.error.mensaje, 'Error');
        },
      });
    }
  }
  patchForm() {
    // Se asume que la fuente a editar es la segunda (índice 1) del arreglo 'fuentes'
    this.formEvaluation.patchValue({
      degreeWorkTitle: this.responsibility?.encuesta.nombre,
      developmentStage:
        this.responsibility?.estadoEtapaDesarrollo.oidEstadoEtapaDesarrollo.toString(),
      qualification_1:
        this.responsibility?.preguntas[0]?.respuesta.toString() || '',
      qualification_2:
        this.responsibility?.preguntas[1]?.respuesta.toString() || '',
      qualification_3:
        this.responsibility?.preguntas[2]?.respuesta.toString() || '',
      qualification_4:
        this.responsibility?.preguntas[3]?.respuesta.toString() || '',
      qualification_5:
        this.responsibility?.preguntas[4]?.respuesta.toString() || '',
      qualification_6:
        this.responsibility?.preguntas[5]?.respuesta.toString() || '',
      qualification_7:
        this.responsibility?.preguntas[6]?.respuesta.toString() || '',
      qualification_8:
        this.responsibility?.preguntas[7]?.respuesta.toString() || '',
      observations: this.responsibility?.Fuente.observacion || '',
    });
    this.computeAverage();
  }

  onQualificationChanges() {
    [
      'qualification_1',
      'qualification_2',
      'qualification_3',
      'qualification_4',
      'qualification_5',
      'qualification_6',
      'qualification_7',
      'qualification_8',
    ].forEach((field) => {
      this.formEvaluation
        .get(field)
        ?.valueChanges.subscribe(() => this.computeAverage());
    });
  }

  computeAverage() {
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
    const values = fields.map((f) => Number(this.formEvaluation.get(f)?.value));
    const sum = values.reduce((a, b) => a + b, 0);
    this.totalAverage = sum / fields.length;
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

  onSignatureFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      this.selectedFiles.signature = file;
      reader.onload = () => {
        const base64String = reader.result?.toString() || '';
        this.formEvaluation.get('studentSignature')?.setValue(base64String);
      };
      reader.readAsDataURL(file);
    }
  }

  triggersSignatureFileUpload() {
    const fileUpload = document.getElementById(
      'studentSignature'
    ) as HTMLInputElement;
    if (fileUpload) {
      fileUpload.click();
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

  generatePdfPreview() {
    const studentInfo = {
      name: this.evaluador?.nombres + ' ' + this.evaluador?.apellidos,
      id: this.evaluado?.identificacion,
      department: this.evaluado?.usuarioDetalle.departamento,
      directorName: this.evaluado?.nombres + ' ' + this.evaluado?.apellidos,
      evaluationDate: this.currentDate.toLocaleDateString(),
      totalAverage: this.totalAverage,
    };

    const pdfBase64 =
      this.responsibilityPdfGeneratorService.generatePdfDocument(
        this.formEvaluation.value,
        studentInfo
      );
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      pdfBase64.base64
    );
    this.formPdf = pdfBase64.file;

    this.selectedFiles.reportDocument = this.formPdf;
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
  
      const fuenteEstudianteFormulario: FuenteEstudianteFormulario = {
        oidFuente: this.responsibility?.Fuente.oidFuente|| 0,
        tipoCalificacion: 'EN_LINEA',
        observacion: this.formEvaluation.get('observations')?.value || '',
        oidEstadoEtapaDesarrollo: this.formEvaluation.get('developmentStage')?.value,
        encuesta: {
          nombre: this.formEvaluation.get('degreeWorkTitle')?.value,
        },
        preguntas: [
          {
            oidPregunta: 1,
            respuesta: Number(this.formEvaluation.get('qualification_1')?.value)
          },
          {
            oidPregunta: 2,
            respuesta: Number(this.formEvaluation.get('qualification_2')?.value)
          },
          {
            oidPregunta: 3,
            respuesta: Number(this.formEvaluation.get('qualification_3')?.value)
          },
          {
            oidPregunta: 4,
            respuesta: Number(this.formEvaluation.get('qualification_4')?.value)
          },
          {
            oidPregunta: 5,
            respuesta: Number(this.formEvaluation.get('qualification_5')?.value)
          },
          {
            oidPregunta: 6,
            respuesta: Number(this.formEvaluation.get('qualification_6')?.value),
          },
          {
            oidPregunta: 7,
            respuesta: Number(this.formEvaluation.get('qualification_7')?.value),
          },
          {
            oidPregunta: 8,
            respuesta: Number(this.formEvaluation.get('qualification_8')?.value),
          },
        ],
      };
  
      this.responsibilitiesService
        .saveResponibilityFormStundent(
          fuenteEstudianteFormulario,
          this.selectedFiles.reportDocument || new File([], ''),
          this.selectedFiles.signature || new File([], '')
        )
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            this.messagesInfoService.showSuccessMessage(
              'Evaluación guardada correctamente',
              'Éxito'
            );
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
