import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { Fuente } from '../../../../../../core/models/base/fuente.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResponsibilitiesServicesService } from '../../services/responsibilities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ResponsabilidadResponse } from '../../../../../../core/models/response/responsabilidad-response.model';
import { FuenteCreate } from '../../../../../../core/models/modified/fuente-create.model';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { ConfirmDialogComponent } from "../../../../../../shared/components/confirm-dialog/confirm-dialog.component";
import { LoadingOverleyComponent } from "../../../../../../shared/components/loading-overley/loading-overley.component";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'responsibilities-edit-evaluation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogComponent,
    LoadingOverleyComponent
  ],
  templateUrl: './responsibilities-edit-evaluation.component.html',
  styleUrl: './responsibilities-edit-evaluation.component.css'
})
export class ResponsibilitiesEditEvaluationComponent {

  @Input()
  public source: Fuente | null = null;

  @Input()
  public responsability: ResponsabilidadResponse | null = null;

  @Input()
  public openModalSelected: boolean = false;

  @Input()
  currentUser: UsuarioResponse | null = null;

  @Output()
  public closeModalEditSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

  private myModal: HTMLElement | null = null;
  public errorFormatFile: boolean = false;
  public errorEvaluation: boolean = false;
  public fileNameSelected: WritableSignal<string> = signal('');
  public fileDeleted: boolean = false;
  public isLoading: boolean = false;

  public fileSelected: File | null = null;

  public form: FormGroup;

  constructor(
    private service: ResponsibilitiesServicesService,
    private toastr: MessagesInfoService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      evaluation: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      observation: [''],
      selectedFile: [null, Validators.required]
    });
  }

  ngAfterViewInit() {
    if (this.openModalSelected) {
      this.myModal = document.getElementById("myModalEdit");
      if (this.myModal) {
        this.myModal.style.display = "flex";
      }
    }
  }

  ngOnInit(): void {
    if (this.source) {
      this.form.patchValue({
        evaluation: this.source.calificacion ? this.source.calificacion.toFixed(1) : '',
        observation: this.source.observacion || ''
      });
      this.fileNameSelected.set(this.source.nombreDocumentoFuente || '');
      this.recoverFile();
      this.getFilebyName();
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

  public recoverFile() {
    this.service.getdownloadSourceFile(this.source!.oidFuente).subscribe(
      {
        next: file => {
          const selectedFile = new File([file], this.source?.nombreDocumentoFuente || '', { type: file.type, lastModified: Date.now() });
          this.form.get('selectedFile')?.setValue(selectedFile);
          this.fileSelected = selectedFile;
        },
        error: error => {
          this.toastr.showErrorMessage('Error al consultar la información', 'Error');
        }
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        this.errorFormatFile = true;
        this.form.get('selectedFile')?.setValue(null);
      } else {
        this.errorFormatFile = false;
        this.fileDeleted = false;
        this.fileSelected = file;
        this.fileNameSelected.update(() => file.name);
      }
    }
  }

  triggerFileUpload() {
    const fileUpload = document.getElementById('uploadFileAssessment') as HTMLInputElement;
    if (fileUpload) {
      fileUpload.click();
    }
  }

  closeModal() {
    if (this.myModal) {
      this.myModal.style.display = "none";
      this.closeModalEditSelected.emit(true);
    }
  }

  getInputClass() {
    const evaluation = this.form.get('evaluation')?.value;
    if (evaluation) {
      if (parseFloat(evaluation) < 0 || parseFloat(evaluation) > 100) {
        this.errorEvaluation = true;
      } else {
        this.errorEvaluation = false;
      }
      return parseFloat(evaluation) >= 0 && parseFloat(evaluation) <= 100 ? 'input-nota' : 'input-nota-error';
    } else {
      return '';
    }
  }

  saveEvaluation() {
    if (this.form.valid && this.fileSelected) {
      const { evaluation, observation } = this.form.value;
      this.updateSource(evaluation, observation, this.fileSelected);
    } else {
      this.toastr.showWarningMessage('Por favor complete todos los campos correctamente.', 'Advertencia');
    }
  }

  private updateSource(evaluation: string, observation: string, selectedFile: File) {
    let sendSource: FuenteCreate[] = [];
    if (this.responsability && selectedFile && evaluation && this.currentUser) {
      this.isLoading = true;
      sendSource = [{
        tipoFuente: "2",
        tipoCalificacion: "DOCUMENTO",
        calificacion: parseFloat(evaluation),
        oidActividad: this.responsability.oidActividad,
        informeEjecutivo: ''
      }];
      this.service.saveResponsibilityEvaluation(selectedFile, observation, sendSource).subscribe({
        next: () => {
          this.toastr.showSuccessMessage('Evaluación guardada correctamente', 'Éxito');
          this.isLoading = false;
          this.closeModalEditSelected.emit(true);
          this.service.setParamsActivitiesFilterSignal(null, null, null, null);
        },
        error: () => {
          this.isLoading = false;
          this.toastr.showErrorMessage('Error al guardar la evaluación', 'Error');
        }
      });
    } else {
      this.isLoading = false;
      this.form.markAllAsTouched();
      this.toastr.showWarningMessage('Asegúrese de que las evaluaciones y el soporte se encuentren diligenciados.', 'Advertencia');
    }
  }

  deleteFile() {
    this.fileDeleted = true;
    this.fileSelected = null;
    this.fileNameSelected.update(() => '');
    this.form.get('selectedFile')?.setValue(null);
    this.form.markAllAsTouched();
  }

  downloadFile() {
    if (this.fileSelected) {
      const url = window.URL.createObjectURL(this.fileSelected);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.fileSelected.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    }
  }

  private getFilebyName() {
    this.service.getdownloadSourceFile(this.source!.oidFuente).subscribe(
      {
        next: file => {
          // this.selectedFile = new File([file], this.source?.nombreDocumentoFuente, { type: file.type, lastModified: Date.now() })
        },
        error: error => {
          this.toastr.showErrorMessage('Error al consultar la información', 'Error');
        }
      });
  }

}
