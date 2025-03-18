import {
  Component,
  effect,
  inject,
  Input,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ActividadResponse } from '../../../../../../core/models/response/actividad-response.model';
import { FuenteCreate } from '../../../../../../core/models/modified/fuente-create.model';
import { PaginatorComponent } from '../../../../../../shared/components/paginator/paginator.component';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
declare var bootstrap: any;

const TOTAL_PAGE = 10;

@Component({
  selector: 'activities-upload-self-assessment',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginatorComponent, ReactiveFormsModule],
  templateUrl: './activities-upload-self-assessment.component.html',
  styleUrl: './activities-upload-self-assessment.component.css',
})
export class ActivitiesUploadSelfAssessmentComponent {
  @Input()
  currentUser: UsuarioResponse | null = null;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private validatorService: ValidatorsService = inject(ValidatorsService);

  public openModalOptionSelected: boolean = false;

  private myModal: HTMLElement | null = null;
  public errorMessageFile: string = '';
  public userActivities: ActividadResponse[] = [];
  public observacionSend: string = '';
  public selectedFile: File | null = null;
  public selfEvaluation: number[] = [];
  public sendSource: FuenteCreate[] = [];
  public evaluationPendingVar: boolean = false;
  public errorCalificacion: boolean = false;
  public filesSelected: File[] = [];
  public currentPage: number = 1;

  public fileNameSelected: WritableSignal<string> = signal('');

  public activityFileReport: ActividadResponse | null = null;

  private service = inject(ActivitiesServicesService);
  private toastr = inject(MessagesInfoService);

  formSelfAssessment: FormGroup = this.formBuilder.group({
    activities: this.formBuilder.array([]),
    observation: [null],
    support: [null],
  });

  recoverActivities(page: number): void {
    if (this.currentUser) {
      this.service
        .getActivities(
          this.currentUser.oidUsuario,
          '',
          '',
          '',
          '',
          page - 1,
          TOTAL_PAGE
        )
        .subscribe({
          next: (response) => {
            this.userActivities.push(...response.data.content);
            if (response.data.totalPages > page) {
              this.recoverActivities(page + 1);
            }
            if (response.data.totalPages === page) {
              this.populateForm();
            }
          },
          error: (error) => {
            this.toastr.showErrorMessage(error.error.mensaje, 'Error');
          },
        });
    }
  }

  isInvalidField(control: AbstractControl) {
    if (control.invalid && (control.dirty || control.touched)) {
      return true;
    }
    return false;
  }

  get activities(): FormArray {
    return this.formSelfAssessment.get('activities') as FormArray;
  }

  populateForm(): void {
    this.userActivities.forEach((activity) => {
      this.activities.push(
        this.formBuilder.group({
          nombreActividad: [activity.nombreActividad],
          calificacion: [
              null,
            [
              Validators.required,
              Validators.pattern(this.validatorService.numericPattern),
              Validators.min(0),
              Validators.max(100),
            ],
          ],
        })
      );
    });
  }

  /*
   * Method to open the modal
   */
  openModal(): void {
    this.myModal = document.getElementById('modal-upload-evaluation');
    if (this.myModal) {
      var bootstrapModal = new bootstrap.Modal(this.myModal);
      this.currentPage = 1;
      this.userActivities = [];
      this.formSelfAssessment.reset();
      this.activities.clear();
      this.recoverActivities(this.currentPage);
      bootstrapModal.show();
    }
  }

  /*
   * Method to trigger the support file upload
   */

  triggerSupportFileUpload() {
    const fileUpload = document.getElementById(
      'uploadFileAssessment'
    ) as HTMLInputElement;
    if (fileUpload) {
      fileUpload.click();
    }
  }

  /*
   * Method to handle the support file selected
   */
  onSupportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        this.errorMessageFile = 'El archivo seleccionado no es un PDF';
        this.selectedFile = null;
      } else {
        this.selectedFile = file;
        this.errorMessageFile = '';
        this.fileNameSelected.set(file.name);
      }
    }
  }

  /*
   * Method to trigger the report file upload
   */
  triggerReportFileUpload(actividad: ActividadResponse) {
    const fileUpload = document.getElementById(
      'uploadFileReport'
    ) as HTMLInputElement;
    if (fileUpload) {
      this.activityFileReport = actividad;
      fileUpload.click();
    }
  }
  /*
   * Method to handle the report file selected
   */

  onRepportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        this.errorMessageFile = 'El archivo seleccionado no es un PDF';
        this.selectedFile = null;
      } else {
        this.errorMessageFile = '';
        this.activityFileReport!.fuentes[0].nombreDocumentoInforme = file.name;
        this.filesSelected.push(file);
      }
    }
  }

  /*
   * Method to download the report file
   */

  downloadReportFile(actividad: ActividadResponse): void {
    let file: File[] = this.filesSelected.filter(
      (file) => file.name === actividad.fuentes[0].nombreDocumentoInforme
    );
    if (file) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(file[0]);
      a.download = file[0].name;
      a.click();
    }
  }

  deleteReportFile(actividad: ActividadResponse): void {
    this.filesSelected.splice(
      this.filesSelected.findIndex(
        (file) => file.name === actividad.fuentes[0].nombreDocumentoInforme
      ),
      1
    );
    actividad.fuentes[0].nombreDocumentoInforme = '';
  }

  /*
   * Method to update the evaluation of the activity
   */
  updateEvaluation(event: Event, activitie: ActividadResponse): void {
    let evaluationInput = event.target as HTMLInputElement;
    const calificacion: number = parseFloat(evaluationInput.value);
    if (!isNaN(calificacion)) {
      if (calificacion >= 0 && calificacion <= 100) {
        activitie.fuentes[0].calificacion = calificacion;
      } else {
        this.errorCalificacion = true;
      }
    } else {
      activitie.fuentes[0].calificacion = 0;
    }
  }

  /*
   * Method to save the evaluation of the activity
   */

  saveEvaluation(): void {
    if (this.selectedFile && this.currentUser) {
      if (this.formSelfAssessment.valid) {
        this.userActivities.forEach((activitie, index) => {
          activitie.fuentes[0].calificacion =
            this.activities.controls[index].value.calificacion;
        });
        this.sendSource = this.userActivities.map((activitie) => ({
          oidActividad: activitie.oidActividad,
          tipoCalificacion: 'DOCUMENTO',
          tipoFuente: '1',
          calificacion: activitie.fuentes[0].calificacion || 0,
          informeEjecutivo: activitie.fuentes[0].nombreDocumentoInforme || '',
        }));
        this.service
          .saveSelfAssessment(
            this.selectedFile,
            this.observacionSend,
            this.sendSource,
            this.filesSelected
          )
          .subscribe({
            next: (data) => {
              this.service.setParamsActivitiesFilterSignal('', '', '', '');
              this.toastr.showSuccessMessage(
                'Evaluación guardada correctamente',
                'Éxito'
              );
              const modalElement = document.getElementById(
                'modal-upload-evaluation'
              );
              if (modalElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance?.hide();
              }
            },
            error: (error) => {
              this.toastr.showErrorMessage(
                'Error al guardar la información',
                'Error'
              );
            },
          });
        this.evaluationPendingVar = false;
      } else {
        this.toastr.showWarningMessage(
          'Asegurese que las evaluaciones y el soporte se encuentren diligenciados.',
          'Advertencia'
        );
      }
    }
  }
}
