import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import { ActividadResponse } from '../../../../../../core/models/response/actividad-response.model';
import { FuenteCreate } from '../../../../../../core/models/modified/fuente-create.model';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { Fuente } from '../../../../../../core/models/base/fuente.model';
declare var bootstrap: any;

const TOTAL_PAGE = 10;

@Component({
  selector: 'activities-edit-evaluation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './activities-edit-evaluation.component.html',
  styleUrls: ['./activities-edit-evaluation.component.css'],
})
export class ActivitiesEditEvaluationComponent {
  @Input()
  currentUser: UsuarioResponse | null = null;

  private activityFileReport: ActividadResponse | null = null;
  private myModal: HTMLElement | null = null;
  public userActivities: ActividadResponse[] = [];
  public errorFileInput: boolean = false;
  public fileNameSelected: string = '';
  public filesSelected: File[] = [];
  public selectedSourceFile: File | null = null;
  public sendSource: FuenteCreate[] = [];
  public sourceFileDeleted: boolean = false;
  public currentPage: number = 1;

  // Inyección de dependencias
  private formBuilder: FormBuilder = inject(FormBuilder);
  private service: ActivitiesServicesService = inject(
    ActivitiesServicesService
  );
  private toastr: MessagesInfoService = inject(MessagesInfoService);
  private validatorService: ValidatorsService = inject(ValidatorsService);

  formSelfEvaluation: FormGroup = this.formBuilder.group({
    activities: this.formBuilder.array([]),
    observation: [''],
  });

  /*
   *  Abre el modal de edición de la evaluación
   */
  openModal() {
    this.myModal = document.getElementById('modal-edit-evaluation');
    if (this.myModal) {
      var bootstrapModal = new bootstrap.Modal(this.myModal);
      this.currentPage = 1;
      this.userActivities = [];
      this.formSelfEvaluation.reset();
      this.activities.clear();
      this.recoverActivities(this.currentPage);
      bootstrapModal.show();
    }
  }

  /*
   *  Recupera las actividades
   */
  recoverActivities(page: number): void {
    if (this.currentUser) {
      this.service
        .getActivities(
          this.currentUser?.oidUsuario,
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
              this.recoverReports();
              this.recoverSource();
              this.populateForm();
            }
          },
          error: (error) => {
            this.toastr.showErrorMessage(error.error.mensaje, 'Error');
          },
        });
    }
  }

  /*
   *  Cierra el modal de edición de la evaluación
   */
  closeModal() {
    if (this.myModal) {
      this.formSelfEvaluation.reset();
      this.activities.clear();
      this.filesSelected = [];
      this.errorFileInput = false;
      this.fileNameSelected = '';
      this.sourceFileDeleted = false;
      this.selectedSourceFile = null;
    }
  }

  //Métodos para manejar el formulario

  /*
   *  Retorna un arreglo de actividades
   */
  get activities(): FormArray {
    return this.formSelfEvaluation.get('activities') as FormArray;
  }

  /*
   *  Llena el formulario con la información de las actividades
   */
  populateForm(): void {
    this.userActivities?.forEach((activitie) => {
      if (
        activitie.fuentes[0].tipoCalificacion !== 'EN_LINEA'
      ) {
        this.fileNameSelected =
          activitie.fuentes[0].nombreDocumentoFuente || '';
        this.formSelfEvaluation
          .get('observation')
          ?.setValue(activitie.fuentes[0].observacion);
      }
      this.activities.push(
        this.formBuilder.group({
          nombreActividad: [activitie.nombreActividad],
          calificacion: [
            activitie.fuentes[0].calificacion,
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
   *  Retorna si un campo es inválido
   */

  isInvalidField(control: AbstractControl) {
    if (control.invalid && (control.dirty || control.touched)) {
      return true;
    }
    return false;
  }

  /*
   *  Retorna el mensaje de error de un campo
   */
  getFieldError(control: AbstractControl, field: string) {
    const errors = control.get(field)?.errors || {};
    if (control.get(field)?.errors) {
      for (const key of Object.keys(errors)) {
        switch (key) {
          case 'required':
            return 'Campo requerido';
          case 'min':
            return 'Valor mínimo es 0';
          case 'max':
            return 'Valor máximo es 100';
          case 'pattern':
            return 'Solo se permiten números';
          default:
            return key;
        }
      }
    }
    return null;
  }

  //Métodos para recuperar los archivos de fuente e informe ejecutivo

  /*
   *  Recupera el archivo de fuente
   */
  recoverSource() {
    this.userActivities.forEach((content, index) => {
      if (
        content.fuentes[0] &&
        content.fuentes[0].oidFuente &&
        content.fuentes[0].tipoCalificacion !== 'EN_LINEA'
      ) {
        this.service
          .getDownloadSourceFile(content.fuentes[0].oidFuente)
          .subscribe({
            next: (response) => {
              const blob = new Blob([response], { type: 'application/pdf' });
              content.fuentes[0].soporte = new File(
                [blob],
                content.fuentes[0].nombreDocumentoFuente || 'default.pdf',
                { type: 'application/pdf' }
              );
              this.selectedSourceFile = content.fuentes[0].soporte;
            },
            error: (error) => {
              this.toastr.showErrorMessage(
                'Error',
                `Error al descargar el archivo para la actividad ${index + 1}`
              );
            },
          });
      }
    });
  }

  /*
   *  Recupera los archivos de informe ejecutivo
   */
  recoverReports(): void {
    this.userActivities.forEach((content, index) => {
      if (
        content.informeEjecutivo &&
        content.fuentes[0].nombreDocumentoInforme
      ) {
        this.service
          .getDownloadReportFile(content.fuentes[0].oidFuente, true)
          .subscribe({
            next: (response) => {
              const blob = new Blob([response], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              this.filesSelected.push(
                new File(
                  [blob],
                  content.fuentes[0].nombreDocumentoInforme || 'default.pdf',
                  { type: 'application/pdf' }
                )
              );
              content.fuentes[0].informeEjecutivo = new File(
                [blob],
                'informeEjecutivo.pdf',
                { type: 'application/pdf' }
              );
            },
            error: (error) => {
              this.toastr.showErrorMessage(
                'Error',
                `Error al descargar el archivo para la actividad ${index + 1}`
              );
            },
          });
      }
    });
  }

  //Métodos para descargar archivos de fuente e informe ejecutivo

  /*
   *  Descarga el archivo de fuente
   */
  downloadSourceFile(): void {
    if (!this.selectedSourceFile) {
      return;
    }
    const blob = new Blob([this.selectedSourceFile], {
      type: 'application/pdf',
    });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  /*
   *  Descarga el archivo de informe ejecutivo
   */
  downloadReport(fuente: Fuente): void {
    if (!fuente.informeEjecutivo) return;

    const blob = new Blob([fuente.informeEjecutivo], {
      type: 'application/pdf',
    });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  //Métodos para eliminar archivos de fuente e informe ejecutivo

  /*
   *  Elimina el archivo de fuente
   */
  deleteSourceFile(): void {
    this.sourceFileDeleted = true;
    this.fileNameSelected = '';
    this.selectedSourceFile = null;
  }

  /*
   *  Elimina el archivo de informe ejecutivo
   */
  deleteReport(activitie: ActividadResponse): void {
    if (activitie) {
      activitie.fuentes[0].nombreDocumentoInforme = '';
      activitie.fuentes[0].informeEjecutivo = null;
      this.filesSelected.splice(
        this.filesSelected.findIndex(
          (file) => file.name === activitie.fuentes[0].nombreDocumentoInforme
        ),
        1
      );
    }
  }

  //Métodos para subir archivos de fuente e informe ejecutivo

  triggerSourceFileUpload() {
    const fileUpload = document.getElementById(
      'uploadFileSource'
    ) as HTMLInputElement;
    if (fileUpload) {
      fileUpload.click();
    }
  }

  onSourceFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        this.errorFileInput = true;
        this.selectedSourceFile = null;
      } else {
        this.selectedSourceFile = file;
        this.errorFileInput = false;
        this.fileNameSelected = file.name;
        this.userActivities.forEach((content, index) => {
          content.fuentes[0].soporte = file;
        });
      }
    }
  }

  triggerReportFileUpload(actividad: ActividadResponse) {
    const fileUpload = document.getElementById(
      'uploadFileReportEdit'
    ) as HTMLInputElement;
    if (fileUpload) {
      this.activityFileReport = actividad;
      fileUpload.click();
    }
  }

  onRepportFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        this.errorFileInput = true;
      } else {
        this.errorFileInput = false;
        this.activityFileReport!.fuentes[0].nombreDocumentoInforme = file.name;
        this.activityFileReport!.fuentes[0].informeEjecutivo = file;
        this.filesSelected.push(file);
      }
    }
  }

  /*
   *  Guarda la información de la evaluación
   */
  saveEvaluation(): void {
    if (
      this.formSelfEvaluation.valid &&
      !this.errorFileInput &&
      this.selectedSourceFile &&
      this.currentUser
    ) {
      const formValues = this.formSelfEvaluation.value;
      this.userActivities.forEach((activitie, index) => {
        activitie.fuentes[0].calificacion =
          formValues.activities[index].calificacion;
      });

      this.userActivities.forEach((activitie, index) => {
        if (activitie.fuentes[0].tipoCalificacion !== 'EN_LINEA') {
          const fuente = {
            oidActividad: activitie.oidActividad,
            tipoCalificacion: 'DOCUMENTO',
            tipoFuente: '1',
            calificacion: activitie.fuentes[0].calificacion || 0,
            informeEjecutivo:
              activitie.fuentes[0].nombreDocumentoInforme || '',
          };
          this.sendSource.push(fuente);
        }
      });

      this.service
        .saveSelfAssessment(
          this.selectedSourceFile!,
          formValues.observation,
          this.sendSource,
          this.filesSelected
        )
        .subscribe({
          next: (response) => {
            this.toastr.showSuccessMessage(
              'Información guardada correctamente',
              'Éxito'
            );
            this.recoverActivitiesSuccess();
            const modalElement = document.getElementById(
              'modal-edit-evaluation'
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
    } else {
      this.toastr.showWarningMessage(
        'Por favor, asegúrese de llenar todos los campos correctamente',
        'Alerta'
      );
    }
  }

  recoverActivitiesSuccess() {
    this.service.setParamsActivitiesFilterSignal('', '', '', '');
  }
}
