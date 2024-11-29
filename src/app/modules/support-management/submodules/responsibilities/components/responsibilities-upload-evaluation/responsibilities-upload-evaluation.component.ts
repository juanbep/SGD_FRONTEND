import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { Responsabilidad } from '../../../../../../core/models/responsibilitie.interface';
import { SourceEvaluation } from '../../../../../../core/models/responsibilitie.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResponsibilitiesServicesService } from '../../services/responsibilities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';

@Component({
  selector: 'responsibilities-upload-evaluation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './responsibilities-upload-evaluation.component.html',
  styleUrl: './responsibilities-upload-evaluation.component.css'
})
export class ResponsibilitiesUploadEvaluationComponent {

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
  public sendSource: SourceEvaluation[] | null = null;
  public observacionSend: string = '';
  public fileNameSelected: WritableSignal<string> = signal('');



  constructor( private service: ResponsibilitiesServicesService, private toastr: MessagesInfoService) {
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
       this.sendSource = [{
        tipoFuente: "2",
        calificacion: this.evaluation,
        oidActividad: this.responsability.oidActividad,
        informeEjecutivo: '',
      }]
      this.service.saveResponsibilityEvaluation(this.selectedFile, this.observacionSend, this.sendSource).subscribe({
        next: data => {
          this.toastr.showSuccessMessage('Evaluación guardada correctamente', 'Éxito');
          this.service.getResponsibilities('4', '', '', '', '').subscribe({
            next: data => {
              this.service.setResponsibilitiesData(data);
            },
            error: error => {
              this.toastr.showErrorMessage('Error al consultar la información', 'Error');
            }
          });
        },
        error: error => {
          this.toastr.showErrorMessage('Error al guardad la información', 'Error');
        }
      });
    }else{
      this.toastr.showWarningMessage('Asegurese que las evaluaciones y el soporte se encuentren diligenciados.', 'Advertencia');
    }
  }

  closeModal() {
    if (this.myModal) {
      this.myModal.style.display = "none";
      this.closeModalUploadSelected.emit(true);
    }
  }
}
