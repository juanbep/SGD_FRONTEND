import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { Actividad, SourceEvaluation } from '../../../../../../core/models/activities.interface';

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
export class ActivitiesEditEvaluationComponent {

  private myModal: HTMLElement | null = null;

  public activitiesTeacher: Actividad[] = [];

  private formBuilder: FormBuilder = inject(FormBuilder);

  private service: ActivitiesServicesService = inject(ActivitiesServicesService);

  private toastr: MessagesInfoService = inject(MessagesInfoService);

  private activityFileReport: Actividad | null = null;

  public filesSelected: File[] = [];

  public errorMessageFile: string = '';

  public fileNameSelected: string = '';

  public sourceFileDeleted: boolean = false;

  public selectedSourceFile: File | null = null;

  public sendSource: SourceEvaluation[] = [];


  formGroup: FormGroup = this.formBuilder.group({
    activities: this.formBuilder.array([]),
    observation: ['']

  });

  constructor() {
    effect(() => {
      this.activitiesTeacher = this.service.getDataActivities();
    });
  }

  get activities(): FormArray {
    return this.formGroup.get('activities') as FormArray;
  }

  populateForm(): void {
    this.fileNameSelected = this.activitiesTeacher[0].fuentes[0].nombreDocumentoFuente;
    this.formGroup.get('observation')?.setValue(this.activitiesTeacher[0].fuentes[0].observacion);
    this.activitiesTeacher.forEach(activitie => {
      this.activities.push(this.formBuilder.group({
        codigoActividad: [activitie.codigoActividad],
        calificacion: [activitie.fuentes[0].calificacion, [Validators.required, Validators.min(0), Validators.max(100)]],
      }));
    });
  }

  saveEvaluation(): void {
    if (this.formGroup.valid) {
      const formValues = this.formGroup.value;
      this.activitiesTeacher.forEach((activitie, index) => {
        activitie.fuentes[0].calificacion = formValues.activities[index].calificacion;
      });
      this.sendSource = this.activitiesTeacher.map(activitie => ({
        tipoFuente: '1',
        calificacion: activitie.fuentes[0].calificacion,
        oidActividad: activitie.oidActividad,
        informeEjecutivo: activitie.fuentes[0].nombreDocumentoInforme || ''
      }));
      this.service.saveSelfAssessment(this.selectedSourceFile!, formValues.observation, this.sendSource, this.filesSelected).subscribe(
        {
          next: (response) => {
            this.service.getActivities('6', '', '', '', '').subscribe({
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
      console.log('Form is invalid');
    }
  }

  openModal() {
    this.myModal = document.getElementById('modal-edit-evaluation');
    if (this.myModal) {
      this.activitiesTeacher = this.service.getDataActivities();
      this.recoveryReports();
      this.recoverSource();
      this.populateForm();
      this.myModal.style.display = "flex";
    }
  }

  closeModal() {
    if (this.myModal) {
      this.myModal.style.display = "none";
      this.formGroup.reset();
      this.activities.clear();
      this.filesSelected = [];
      this.errorMessageFile = '';
      this.fileNameSelected = '';
      this.sourceFileDeleted = false;
      this.selectedSourceFile = null;
    }
  }

  triggerReportFileUpload(actividad: Actividad) {
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
        this.errorMessageFile = 'El archivo seleccionado no es un PDF';
      } else {
        this.errorMessageFile = '';
        this.activityFileReport!.fuentes[0].nombreDocumentoInforme = file.name;
        this.activityFileReport!.fuentes[0].informeEjecutivo = file;
        this.filesSelected.push(file);
      }
    }
  }

  downloadReport(sourceId: number): void {
    this.activitiesTeacher.forEach((activity, index) => {
      if (activity.fuentes[0].oidFuente === sourceId) {
        if (activity.fuentes[0].informeEjecutivo) {
          const blob = new Blob([activity.fuentes[0].informeEjecutivo], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        }
      }
    });
  }

  deleteReport(activitie: Actividad): void {
    if (activitie) {
      activitie.fuentes[0].nombreDocumentoInforme = '';
      activitie.fuentes[0].informeEjecutivo = null;
    }
  }

  deleteSourceFile(): void {
    this.sourceFileDeleted = true;
    this.fileNameSelected = '';
    this.selectedSourceFile = null;
  }

  recoveryReports(): void {
    this.activitiesTeacher.forEach((activity, index) => {
      if (activity.informeEjecutivo && activity.fuentes[0].nombreDocumentoInforme) {
        this.service.getDownloadReportFile(activity.fuentes[0].oidFuente, true).subscribe(
          {
            next: (response) => {
              const blob = new Blob([response], { type: 'application/pdf' });
              const url = window.URL.createObjectURL(blob);
              activity.fuentes[0].informeEjecutivo = new File([blob], 'informeEjecutivo.pdf', { type: 'application/pdf' });
            },
            error: (error) => {
              this.toastr.showErrorMessage('Error', `Error al descargar el archivo para la actividad ${index + 1}`);
            }
          }
        );
      }
    });
  }

  recoverSource(){
    this.activitiesTeacher.forEach((activity, index) => {
      if (activity.fuentes[0].oidFuente) {
        this.service.getdownloadSourceFile(activity.fuentes[0].oidFuente).subscribe(
          {
            next: (response) => {
              const blob = new Blob([response], { type: 'application/pdf' });
              activity.fuentes[0].soporte = new File([blob], 'informeEjecutivo.pdf', { type: 'application/pdf' });
              this.selectedSourceFile = activity.fuentes[0].soporte;
            },
            error: (error) => {
              this.toastr.showErrorMessage('Error', `Error al descargar el archivo para la actividad ${index + 1}`);
            }
          }
        );
      }
    });
  }
  
  downloadSourceFile(): void {
    this.service.getdownloadSourceFile(this.activitiesTeacher[0].fuentes[0].oidFuente).subscribe(
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

  onSourceFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf') {
        this.errorMessageFile = 'El archivo seleccionado no es un PDF';
        this.selectedSourceFile = null;
      } else {
        this.selectedSourceFile = file;
        this.errorMessageFile = '';
        this.fileNameSelected = file.name;
        this.activitiesTeacher.forEach((activity, index) => {
          activity.fuentes[0].soporte = file;
        });
      }
    }
  }

  triggerSourceFileUpload() {
    const fileUpload = document.getElementById('uploadFileSource') as HTMLInputElement;
    if (fileUpload) {
      fileUpload.click();
    }
  }

}