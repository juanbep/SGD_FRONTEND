import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { Activity, ActivityResponse, SourceEvaluation } from '../../../../../../core/models/activities.interface';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
declare var bootstrap: any;

@Component({
  selector: 'activities-edit-evaluation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './activities-edit-evaluation.component.html',
  styleUrls: ['./activities-edit-evaluation.component.css']
})
export class ActivitiesEditEvaluationComponent  {

  private activityFileReport: Activity | null = null;
  private myModal: HTMLElement | null = null;
  public teacherActivities: ActivityResponse | null = null;
  public errorFileInput: boolean = false;
  public fileNameSelected: string = '';
  public filesSelected: File[] = [];
  public selectedSourceFile: File | null = null;
  public sendSource: SourceEvaluation[] = [];
  public sourceFileDeleted: boolean = false;

  // Inyección de dependencias
  private formBuilder: FormBuilder = inject(FormBuilder);
  private service: ActivitiesServicesService = inject(ActivitiesServicesService);
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
      this.recoverActivities();
      bootstrapModal.show();
    }
  }

  /*
  *  Recupera las actividades
  */
  recoverActivities() {
    this.service.getActivities('92', '', '', '', '',null,null).subscribe({
      next: data => {
        this.teacherActivities = data;
        this.recoverReports();
        this.recoverSource();
        this.populateForm();
      },
      error: error => {
        this.toastr.showErrorMessage('Error al consultar la información', 'Error');
      }
    });
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
    if(this.teacherActivities?.content[0].fuentes[0]){
      this.fileNameSelected = this.teacherActivities?.content[0].fuentes[0].nombreDocumentoFuente || '';
      this.formSelfEvaluation.get('observation')?.setValue(this.teacherActivities?.content[0].fuentes[0].observacion);
      this.teacherActivities?.content.forEach(activitie => {
        this.activities.push(this.formBuilder.group({
          nombreActividad: [activitie.nombreActividad],
          calificacion: [activitie.fuentes[0].calificacion, [Validators.required, Validators.pattern(this.validatorService.numericPattern), Validators.min(0), Validators.max(100)]],
        }));
      });
    }
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
    this.teacherActivities!.content.forEach((content, index) => {
      if (content.fuentes[0] && content.fuentes[0].oidFuente) {
        this.service.getdownloadSourceFile(content.fuentes[0].oidFuente).subscribe(
          {
            next: (response) => {
              const blob = new Blob([response], { type: 'application/pdf' });
              content.fuentes[0].soporte = new File([blob], content.fuentes[0].nombreDocumentoFuente || 'default.pdf', { type: 'application/pdf' });
              this.selectedSourceFile = content.fuentes[0].soporte;
            },
            error: (error) => {
              this.toastr.showErrorMessage('Error', `Error al descargar el archivo para la actividad ${index + 1}`);
            }
          }
        );
      }
    });
  }

  /*
  *  Recupera los archivos de informe ejecutivo
  */
  recoverReports(): void {
    this.teacherActivities?.content.forEach((content, index) => {
      if (content.informeEjecutivo && content.fuentes[0].nombreDocumentoInforme) {
        this.service.getDownloadReportFile(content.fuentes[0].oidFuente, true).subscribe(
          {
            next: (response) => {
              const blob = new Blob([response], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              this.filesSelected.push(new File([blob], content.fuentes[0].nombreDocumentoInforme || 'default.pdf', { type: 'application/pdf' }));
              content.fuentes[0].informeEjecutivo = new File([blob], 'informeEjecutivo.pdf', { type: 'application/pdf' });
            },
            error: (error) => {
              this.toastr.showErrorMessage('Error', `Error al descargar el archivo para la actividad ${index + 1}`);
            }
          }
        );
      }
    });
  }

  //Métodos para descargar archivos de fuente e informe ejecutivo

  /*
  *  Descarga el archivo de fuente
  */
  downloadSourceFile(): void {
    const oidFuente = this.teacherActivities?.content[0].fuentes[0].oidFuente;
    if (oidFuente !== undefined) {
      this.service.getdownloadSourceFile(oidFuente).subscribe(
        {
          next: (response) => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url);
          },
          error: (error) => {
            this.toastr.showErrorMessage('Error', 'Error al descargar el archivo');
          }
        }
      )
    }
  }

  /*
  *  Descarga el archivo de informe ejecutivo
  */
  downloadReport(sourceId: number): void {
    this.teacherActivities?.content.forEach((content, index) => {
      if (content.fuentes[0].oidFuente === sourceId) {
        if (content.fuentes[0].informeEjecutivo) {
          const blob = new Blob([content.fuentes[0].informeEjecutivo], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        }
      }
    });
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
  deleteReport(activitie: Activity): void {
    if (activitie) {
      activitie.fuentes[0].nombreDocumentoInforme = '';
      activitie.fuentes[0].informeEjecutivo = null;
      this.filesSelected.splice(this.filesSelected.findIndex(file => file.name === activitie.fuentes[0].nombreDocumentoInforme), 1);

    }
  }



  //Métodos para subir archivos de fuente e informe ejecutivo

  triggerSourceFileUpload() {
    const fileUpload = document.getElementById('uploadFileSource') as HTMLInputElement;
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
        this.teacherActivities?.content.forEach((content, index) => {
          content.fuentes[0].soporte = file;
        });
      }
    }
  }

  triggerReportFileUpload(actividad: Activity) {
    const fileUpload = document.getElementById('uploadFileReportEdit') as HTMLInputElement;
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
    if (this.formSelfEvaluation.valid && !this.errorFileInput && this.selectedSourceFile) {
      const formValues = this.formSelfEvaluation.value;
      this.teacherActivities?.content.forEach((activitie, index) => {
        activitie.fuentes[0].calificacion = formValues.activities[index].calificacion;
      });
      this.sendSource = this.teacherActivities!.content.map(activitie => ({
        tipoFuente: '1',
        calificacion: activitie.fuentes[0].calificacion,
        oidActividad: activitie.oidActividad,
        informeEjecutivo: activitie.fuentes[0].nombreDocumentoInforme || ''
      }));
      this.service.saveSelfAssessment(this.selectedSourceFile!, formValues.observation, this.sendSource, this.filesSelected).subscribe(
        {
          next: (response) => {
            this.service.getActivities('6', '', '', '', '',0,10).subscribe({
              next: data => {
                this.service.setDataActivities(data);
                this.toastr.showSuccessMessage('Información guardada correctamente', 'Éxito');
                this.sourceFileDeleted = false;
                this.closeModal();
              },
              error: error => {
                this.toastr.showErrorMessage('Error al consultar la información', 'Error');
              }
            });
          },
          error: (error) => {
            this.toastr.showErrorMessage('Error al guardar la información', 'Error');
          }
        }
      );

    } else {
      this.toastr.showWarningMessage('Por favor, asegúrese de llenar todos los campos correctamente', 'Alerta');
    }
  }
}