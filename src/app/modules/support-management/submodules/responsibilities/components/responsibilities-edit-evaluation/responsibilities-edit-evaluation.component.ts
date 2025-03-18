import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { Fuente } from '../../../../../../core/models/base/fuente.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResponsibilitiesServicesService } from '../../services/responsibilities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ResponsabilidadResponse } from '../../../../../../core/models/response/responsabilidad-response.model';
import { FuenteCreate } from '../../../../../../core/models/modified/fuente-create.model';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';

@Component({
  selector: 'responsibilities-edit-evaluation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
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
  public evaluation: string = '';
  public observation: string = '';
  public fileNameSelected: WritableSignal<string> = signal('');
  public selectedFile: File | null = null;
  public fileDeleted: boolean = false;


  constructor(private service: ResponsibilitiesServicesService, private toastr: MessagesInfoService) { }

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
      this.evaluation = this.source.calificacion? this.source.calificacion.toFixed(1) : '';
      this.observation = this.source.observacion? this.source.observacion : '';
      this.fileNameSelected.set(this.source.nombreDocumentoFuente || '');
      this.recoverFile();
      this.getFilebyName();
    }
  }

  public recoverFile(){
    this.service.getdownloadSourceFile(this.source!.oidFuente).subscribe(
      {
        next: file => {
          this.selectedFile = new File([file], this.source?.nombreDocumentoFuente || '', { type: file.type, lastModified: Date.now() })
        },
        error: error => {
          this.toastr.showErrorMessage('Error al consultar la información', 'Error');
        }
      });
  }

  public updateSource() {
    let sendSource: FuenteCreate[] = [];
    if (this.responsability && (this.selectedFile) && this.evaluation && this.currentUser) {
      sendSource = [{
        tipoFuente: "2",
        tipoCalificacion: "DOCUMENTO",
        calificacion: parseFloat(this.evaluation),
        oidActividad: this.responsability.oidActividad,
        informeEjecutivo: ''
      }]
      this.service.saveResponsibilityEvaluation(this.selectedFile, this.observation, sendSource).subscribe
        ({
          next: () => {
            this.toastr.showSuccessMessage('Evaluación guardada correctamente', 'Éxito');
            this.closeModalEditSelected.emit(true);
            this.service.setParamsActivitiesFilterSignal(null, null, null, null);
          },
          error: error => {
            this.toastr.showErrorMessage('Error al guardar la evaluación', 'Error');
          }
        });
    }else{
      this.toastr.showWarningMessage('Asegurese que las evaluaciones y el soporte se encuentren diligenciados.', 'Advertencia');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {

      const file = input.files[0];

      if (file.type !== 'application/pdf') {

        this.errorFormatFile = true;
        this.selectedFile = null;
      } else {
        this.selectedFile = file;
        this.errorFormatFile = false;
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


  closeModal() {
    if (this.myModal) {
      this.myModal.style.display = "none";
      this.closeModalEditSelected.emit(true);

    }
  }


  getInputClass() {
    if (this.evaluation) {
      if (parseFloat(this.evaluation) < 0 || parseFloat(this.evaluation) > 100) {
        this.errorEvaluation = true;
      } else {
        this.errorEvaluation = false;
      }
      return parseFloat(this.evaluation) >= 0 && parseFloat(this.evaluation) <= 100 ? 'input-nota' : 'input-nota-error';
    } else {
      return '';
    }
  }

  saveEvaluation() {
    this.updateSource();
  }

  deleteFile() {
    this.fileDeleted = true;
    this.fileNameSelected.set('');
    this.selectedFile = null;
  }

  downloadFile() {
    if (this.source) {
      this.service.getdownloadSourceFile(this.source.oidFuente).subscribe(
        {
          next: blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.source!.nombreDocumentoFuente || '';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          },
          error: error => {
            this.toastr.showErrorMessage('Error al consultar la información', 'Error');
          }

        });
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
