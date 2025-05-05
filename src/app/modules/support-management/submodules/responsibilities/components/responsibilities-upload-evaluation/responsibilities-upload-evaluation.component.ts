import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResponsibilitiesServicesService } from '../../services/responsibilities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ResponsabilidadResponse } from '../../../../../../core/models/response/responsabilidad-response.model';
import { FuenteCreate } from '../../../../../../core/models/modified/fuente-create.model';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { LoadingOverleyComponent } from '../../../../../../shared/components/loading-overley/loading-overley.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'responsibilities-upload-evaluation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingOverleyComponent],
  templateUrl: './responsibilities-upload-evaluation.component.html',
  styleUrl: './responsibilities-upload-evaluation.component.css',
})
export class ResponsibilitiesUploadEvaluationComponent {
  @Input()
  responsability: ResponsabilidadResponse | null = null;

  @Input()
  openModalUploadSelected: boolean = false;

  @Input()
  currentUser: UsuarioResponse | null = null;

  @Output()
  public closeModalUploadSelected: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  private myModal: HTMLElement | null = null;
  public errorMessageFile: string = '';
  public errorMessageNote: string = '';
  public inputValue: string = '';
  public sendSource: FuenteCreate[] | null = null;
  public fileNameSelected: WritableSignal<string> = signal('');
  public isLoading: boolean = false;
  public form: FormGroup;

  public filterParams: {
    activityName: string | null;
    activityType: string | null;
    evaluatorName: string | null;
    evaluatorRole: string | null;
  } | null = null;


  constructor(
    private service: ResponsibilitiesServicesService,
    private toastr: MessagesInfoService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      evaluation: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      selectedFile: [null, Validators.required],
      observacionSend: ['']
    });
  }

  ngOnInit(): void {
    if (this.openModalUploadSelected) {
      this.myModal = document.getElementById('myModal');
    }
    if (this.myModal) {
      this.myModal.style.display = 'flex';
    }
  }

  openModal(): void {
    if (this.form.get('evaluation')?.value) {
      (<HTMLInputElement>document.getElementById('input-note')).value =
        this.form.get('evaluation')?.value.toString();
    }
  }

  getInputClass(): string {
    const evaluation = this.form.get('evaluation')?.value;
    if (evaluation) {
      if (evaluation < 0 || evaluation > 100) {
        this.errorMessageNote = 'La nota debe estar entre 0 y 100';
      } else {
        this.errorMessageNote = '';
      }
      return evaluation >= 0 && evaluation <= 100
        ? 'input-nota'
        : 'input-nota-error';
    } else {
      return '';
    }
  }

  isInvalidField(field: string) {
    const control = this.form.get(field);
    return (
      control &&
      control.errors &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  getFieldError(field: string): string | null {
    if (!this.form.controls[field]) return null;
    const control = this.form.controls[field];
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


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        this.errorMessageFile = 'El archivo seleccionado no es un PDF';
        this.form.get('selectedFile')?.setValue(null);
      } else {
        this.form.get('selectedFile')?.setValue(file);
        this.fileNameSelected.set(file.name);
        this.errorMessageFile = '';
      }
    }
  }

  triggerFileUpload() {
    const fileUpload = document.getElementById(
      'uploadFileAssessmentResponsability'
    ) as HTMLInputElement;
    if (fileUpload) {
      fileUpload.click();
    }
  }

  saveEvaluation(): void {
    this.isLoading = true;
    if (this.form.valid && this.responsability && this.currentUser) {
      const { evaluation, selectedFile, observacionSend } = this.form.value;
      this.sendSource = [
        {
          tipoFuente: '2',
          tipoCalificacion: 'DOCUMENTO',
          calificacion: evaluation,
          oidActividad: this.responsability.oidActividad,
          informeEjecutivo: '',
        },
      ];
      this.service
        .saveResponsibilityEvaluation(selectedFile, observacionSend, this.sendSource)
        .subscribe({
          next: (data) => {
            this.isLoading = false;
            this.toastr.showSuccessMessage(
              'Evaluación guardada correctamente',
              'Éxito'
            );
            this.closeModal();
            const filterParams = this.service.getParamsActivitiesFilterSignal();
            this.service.setParamsActivitiesFilterSignal(
              filterParams.activityName,
              filterParams.activityType,
              filterParams.evaluatorName,
              filterParams.evaluatorRole
            );
          },
          error: (error) => {
            this.toastr.showErrorMessage('Error al guardar la información', 'Error');
          },
        });
    } else {
      this.isLoading = false;
      this.form.markAllAsTouched();
      this.toastr.showWarningMessage(
        'Asegúrese de que las evaluaciones y el soporte se encuentren diligenciados.',
        'Advertencia'
      );
    }
  }

  closeModal() {
    if (this.myModal) {
      this.myModal.style.display = 'none';
      this.closeModalUploadSelected.emit(true);
    }
  }
}
