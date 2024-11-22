import { Component, signal, WritableSignal } from '@angular/core';
import { Actividad, SourceEvaluation } from '../../../../../../core/activities.interface';
import { SupportManagementService } from '../../../../services/support-management.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  public myActivities: Actividad[] = [];
  public observacionSend: string = '';
  public selectedFile: File | null = null;
  public selfEvaluation: number[] = []; 
  public sendSource: SourceEvaluation[] = [];
  public evaluationPendingVar: boolean = false;
  public errorCalificacion: boolean = false;
  public indexSelected: number = 0;
  public filesSelected: File[] = [];

  public fileNameSelected: WritableSignal<string> = signal('');
  
  public selectedFileReport: File | null = null;
  public activityFileReport: Actividad | null = null;

  constructor(private activitieService: SupportManagementService) {

  }

  ngOnInit(): void {
    this.dataActivities();
  }

  dataActivities() {
    this.activitieService.allActivitiesWithoutFilter("6").subscribe(data => {
      this.myActivities = data;
      this.evaluationPendingVar = this.evaluationPending();
    });
  }

  evaluationPending(): boolean {
    for(let i = 0; i < this.myActivities.length; i++){
      if(this.myActivities[i].fuentes[0].estadoFuente === "Pendiente"){
        return true;
      }
    }
    return false;

  }


  onFileSelected(event: Event): void {
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

  triggerFileUpload() {
    const fileUpload = document.getElementById('uploadFileAssessment') as HTMLInputElement;
    if (fileUpload) {
      fileUpload.click();
    }
  }

  triggerFileUploadReport(actividad: Actividad) {
    const fileUpload = document.getElementById('uploadFileReport') as HTMLInputElement;
    if (fileUpload) {
      this.activityFileReport = actividad;
      fileUpload.click();
    }
  }

  openModal(): void {
    this.myModal = document.getElementById("myModalUploadFile");
    if (this.myModal) {
      this.myModal.style.display = "flex";
    }
  }

  saveEvaluation(): void {
    
    if(this.myActivities){
      console.log(this.myActivities);
      
      this.sendSource = this.myActivities.map(activitie => ({
        tipoFuente: "1",
        calificacion: activitie.fuentes[0].calificacion,
        oidActividad: activitie.oidActividad,
        informeEjecutivo: activitie?.fuentes[0].informeEjecutivo || ''
      }));
    }
    
    if (this.selectedFile) {
      this.activitieService.sendActivities(this.selectedFile, this.observacionSend, this.sendSource, this.filesSelected);
      this.evaluationPendingVar = false;
      this.closeModal();
    } else {
      console.error('No file selected');
    }
  }

  updateEvaluation(event: Event, activitie: Actividad): void {
    let evaluationInput = event.target as HTMLInputElement;
    const calificacion = parseFloat(evaluationInput.value);
    if (!isNaN(calificacion)) {
      if(calificacion >= 0 && calificacion <= 100){
        activitie.fuentes[0].calificacion = calificacion;
        this.errorCalificacion = false;
      }else{
        this.errorCalificacion = true;
      }
    }
  }

  uploadReport(activitie: Actividad, event: Event, index: number): void {
    console.log(index);
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log(file);
      if (file.type !== 'application/pdf') {
        this.errorMessageFile = 'El archivo seleccionado no es un PDF';
        this.selectedFile = null;
      } else {
        this.selectedFileReport = file;
        this.errorMessageFile = '';
        console.log(this.activityFileReport+ ' ' + file.name);
        this.activityFileReport!.fuentes[0].informeEjecutivo = file.name;
        console.log(this.myActivities);
        this.filesSelected.push(file);
      }
    }
  }

  closeModal() {
    if (this.myModal) {

      this.myModal.style.display = "none";
    }
  }
}
