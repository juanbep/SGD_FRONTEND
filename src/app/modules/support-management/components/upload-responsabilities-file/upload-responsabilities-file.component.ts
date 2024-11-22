import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, WritableSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupportManagementService } from '../../services/support-management.service';
import { SourceEvaluation, SourceResposability } from '../../../../core/activities.interface';
import { Responsabilidad } from '../../../../core/responsabilitie.interface';
import { SupportManagementResponsabilitiesService } from '../../services/support-management-responabilities.service';

@Component({
  selector: 'support-management-upload-responsabilities-file',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-responsabilities-file.component.html',
  styleUrl: './upload-responsabilities-file.component.css'
})
export class UploadResponsabilitiesFileComponent implements OnInit {

  @Input()
  responsability: Responsabilidad | null = null;

  @Input()
  openModalUploadSelected: boolean = false;

  @Output()
  public closeModalUploadSelected:  EventEmitter<boolean> = new EventEmitter<boolean>();

  private myModal: HTMLElement | null = null;
  public errorMessageFile: string = '';
  public errorMessageNote: string = '';
  public inputValue: string = '';
  public evaluation: number | null = null;
  public selectedFile: File | null = null;
  public sendSource: SourceResposability[] | null = null;
  public observacionSend: string = '';
  public fileNameSelected: WritableSignal<string> = signal('');



  constructor( private service: SupportManagementResponsabilitiesService) {
  }


  ngOnInit(): void {
    
    if(this.openModalUploadSelected){
      this.myModal = document.getElementById("myModal");
    }
    if(this.myModal) {
      this.myModal.style.display = "flex";
    }

  }


  openModal(): void {

    if (this.evaluation) {
      (<HTMLInputElement>document.getElementById("input-note")).value = this.evaluation.toString();

    }
  }


  getInputClass(): string {
    if (this.evaluation) {
      if (this.evaluation < 0 || this.evaluation > 100) {
        this.errorMessageNote = 'La nota debe estar entre 0 y 100';
      } else {
        this.errorMessageNote = '';
      }
      return this.evaluation >= 0 && this.evaluation <= 100 ? 'input-nota' : 'input-nota-error';
    } else {
      return '';
    }

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
        this.fileNameSelected.set(this.selectedFile.name)
        this.errorMessageFile = '';
      }
    }
  }

  triggerFileUpload() {
    const fileUpload = document.getElementById('uploadFileAssessmentResponsability') as HTMLInputElement;
    if (fileUpload) {
      fileUpload.click();
    }
  }


  saveEvaluation(): void {


    if(this.responsability && this.evaluation && this.selectedFile){
      console.log(this.responsability);
       this.sendSource = [{
        tipoFuente: "2",
        calificacion: this.evaluation,
        oidActividad: this.responsability.oidActividad
      }]
      console.log(this.sendSource);
      this.service.sendEvaluationResponsabilities(this.selectedFile, this.observacionSend, this.sendSource);
      //this.service.allResponsabilitiesByUser("4");
    }
  }

  closeModal() {
    if (this.myModal) {
      this.myModal.style.display = "none";
      this.closeModalUploadSelected.emit(true);
    }
  }
}
