import { Component, effect, signal, WritableSignal } from '@angular/core';
import { Actividad, SourceEvaluation } from '../../../../../../core/models/activities.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';

@Component({
  selector: 'activities-upload-self-assessment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './activities-upload-self-assessment.component.html',
  styleUrl: './activities-upload-self-assessment.component.css'
})
export class ActivitiesUploadSelfAssessmentComponent {
  private myModal: HTMLElement | null = null;
  public errorMessageFile: string = '';
  public userActivities: Actividad[] = [];
  public observacionSend: string = '';
  public selectedFile: File | null = null;
  public selfEvaluation: number[] = []; 
  public sendSource: SourceEvaluation[] = [];
  public evaluationPendingVar: boolean = false;
  public errorCalificacion: boolean = false;
  public indexSelected: number = 0;
  public filesSelected: File[] = [];

  public fileNameSelected: WritableSignal<string> = signal('');
  
  public activityFileReport: Actividad | null = null;

  constructor(private service: ActivitiesServicesService, private toastr: MessagesInfoService) {
    effect(() => {
      this.userActivities = this.service.getDataActivities();
      this.evaluationPendingVar = this.evaluationPending();
    });
  }
  
  ngOnInit(): void {
  }

  /*
  * Method to open the modal
  */
  openModal(): void {
    this.myModal = document.getElementById("myModalUploadFile");
    if (this.myModal) {
      this.myModal.style.display = "flex";
    }
  }

  /*
  * Method to close the modal
  */

  closeModal() {
    if (this.myModal) {

      this.myModal.style.display = "none";
    }
  }
  
  /*
  * Method to evaluate if there are pending evaluations
  */
  evaluationPending(): boolean {
    if(this.userActivities){
      for(let i = 0; i < this.userActivities.length; i++){
        if(this.userActivities[i].fuentes[0].estadoFuente === "Pendiente"){
          return true;
        }
      }
      return false;
    }
    return false;
  }


  /*
  * Method to trigger the support file upload
  */

  triggerSupportFileUpload() {
    const fileUpload = document.getElementById('uploadFileAssessment') as HTMLInputElement;
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
  triggerReportFileUpload(actividad: Actividad) {
    const fileUpload = document.getElementById('uploadFileReport') as HTMLInputElement;
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
        this.activityFileReport!.fuentes[0].informeEjecutivo = file.name;
        this.filesSelected.push(file);
      }
    }
  }

  /*
  * Method to download the report file
  */

  downloadReportFile(actividad: Actividad): void {
    let file:File[] = this.filesSelected.filter(file => file.name === actividad.fuentes[0].informeEjecutivo);
    if(file){
      var a = document.createElement("a");
      a.href = URL.createObjectURL(file[0]);
      a.download = file[0].name;
      a.click();
    }
  }

  deleteReportFile(actividad: Actividad): void {  
    this.filesSelected.splice(this.filesSelected.findIndex(file => file.name === actividad.fuentes[0].informeEjecutivo), 1);
    actividad.fuentes[0].informeEjecutivo = '';
    console.log(this.filesSelected);
  }

  /*
  * Method to update the evaluation of the activity
  */
  updateEvaluation(event: Event, activitie: Actividad): void {
    let evaluationInput = event.target as HTMLInputElement;
    console.log(evaluationInput.value);
    const calificacion : number = parseFloat(evaluationInput.value);
    if (!isNaN(calificacion)) {
      if(calificacion >= 0 && calificacion <= 100){
        activitie.fuentes[0].calificacion = calificacion;
        this.errorCalificacion = false;
      }else{
        this.errorCalificacion = true;
      }
    }else{
      activitie.fuentes[0].calificacion = 0;
    }
  }

  /*
  * Method to save the evaluation of the activity
  */
  
  saveEvaluation(): void {
    if (this.selectedFile && this.allEvaluationsdone()) {
      if(this.userActivities ){      
        this.sendSource = this.userActivities.map(activitie => ({
          tipoFuente: "1",
          calificacion: activitie.fuentes[0].calificacion,
          oidActividad: activitie.oidActividad,
          informeEjecutivo: activitie?.fuentes[0].informeEjecutivo || ''
        }));
      }
      this.service.saveSelfAssessment(this.selectedFile, this.observacionSend, this.sendSource, this.filesSelected).subscribe({
        next: data => {
          this.service.getActivities('6', '', '', '', '').subscribe({
            next: data => {
              this.service.setDataActivities(data);
              this.toastr.showSuccessMessage('Información guardada correctamente', 'Éxito');
            },
            error: error => {
              this.toastr.showErrorMessage('Error al consultar la información', 'Error');
            }
          });

        },
        error: error => {
          this.toastr.showErrorMessage('Error al guardar la información', 'Error');
        }
      });
      this.evaluationPendingVar = false;
      this.closeModal();
    } else {
      this.toastr.showWarningMessage('Asegurese que las evaluaciones y el soporte se encuentren diligenciados.', 'Advertencia');
    }
  }

  private allEvaluationsdone(): boolean {
    if(this.userActivities){
      for(let i = 0; i < this.userActivities.length; i++){
        if(this.userActivities[i].fuentes[0].calificacion === 0){
          return false;
        }
      }
      return true;
    }
    return false;
  }
 
  
}
