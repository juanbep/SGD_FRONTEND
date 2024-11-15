import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SupportManagementService } from '../../services/support-management.service';
import { Actividad, SourceEvaluation } from '../../../../core/activities.interface';
import { FormsModule } from '@angular/forms';
import { MessagesInfoService } from '../../../../shared/services/messages-info.service';


@Component({
  selector: 'supportMangement-upload-self-assessment-file',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-file-self-assessment.component.html',
  styleUrl: './upload-file-self-assessment.component.css'
})
export class UploadFileComponent implements OnInit {

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
      }
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
      this.sendSource = this.myActivities.map(activitie => ({
        tipoFuente: "1",
        calificacion: activitie.fuentes[0].calificacion,
        oidActividad: activitie.oidActividad
      }));
    }
  
    if (this.selectedFile) {
      this.activitieService.sendActivities(this.selectedFile, this.observacionSend, this.sendSource);
      this.evaluationPendingVar = false;
      this.closeModal();
    } else {
      console.error('No file selected');
    }
  }

  updateEvaluation(event: Event, activitie: Actividad, index: number): void {
    let evaluationInput = event.target as HTMLInputElement;
    this.indexSelected = index;
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

  closeModal() {
    if (this.myModal) {

      this.myModal.style.display = "none";
    }
  }
}
