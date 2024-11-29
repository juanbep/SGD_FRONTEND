import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { Actividad, Fuente, SourceEvaluation } from '../../../../../../core/models/activities.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';

@Component({
  selector: 'activities-edit-evaluation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './activities-edit-evaluation.component.html',
  styleUrl: './activities-edit-evaluation.component.css'
})
export class ActivitiesEditEvaluationComponent {

  @Input()
  public source: Fuente | null = null;

  @Input()
  public activity: Actividad | null = null;

  @Input()
  public openModalSelected: boolean = false;

  @Output()
  public closeModalEditSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

  private myModal: HTMLElement | null = null;
  public errorFormatFile: boolean = false;
  public errorEvaluation: boolean = false;
  public evaluation: string = '';
  public observation: string = '';
  public fileName: string = '';
  public fileNameSelected: WritableSignal<string> = signal('');
  public fileReportNameSelected: WritableSignal<string> = signal('');
  public selectedFile: File | null = null;
  public fileDeleted: boolean = false;
  public reportDeleted: boolean = false;
  public reports: File[] = [];

  constructor(
    private service: ActivitiesServicesService, private toastr: MessagesInfoService) { }

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
      this.evaluation = this.source.calificacion.toFixed(1);
      this.observation = this.source.observacion;
      this.fileNameSelected.set(this.source.nombreDocumentoFuente);
      this.fileReportNameSelected.set(this.source.nombreDocumentoInforme);
      this.getFilebyName();
      if(this.activity?.informeEjecutivo){
        this.recoverySupport(this.source.oidFuente);
      }
    }
  }


  public updateSource() {
    let sendSource: SourceEvaluation[] = [];
    if (this.activity && this.selectedFile && this.evaluation) {
      sendSource = [{
        tipoFuente: "1",
        calificacion: parseFloat(this.evaluation),
        oidActividad: this.activity.oidActividad,
        informeEjecutivo: this.reports.length > 0 ? this.reports[0].name : '',
      }]
      this.service.saveSelfAssessment(this.selectedFile, this.observation, sendSource, this.reports).subscribe(
        {
          next: () => {
            this.service.getActivities('6', '', '', '', '').subscribe({
              next: data => {
                this.service.setDataActivities(data);
                this.toastr.showSuccessMessage('Información guardada correctamente', 'Éxito');
                this.closeModal();
              },
              error: error => {
                this.toastr.showErrorMessage('Error al consultar la información', 'Error');
              }
            });
          },
          error: error => {
            this.toastr.showErrorMessage('Error al guardar la evaluación', 'Error');
          }
        });
    }else{
      this.toastr.showWarningMessage('Asegurese que las evaluaciones y el soporte se encuentren diligenciados.', 'Advertencia');
    }
  }

  onFileReportSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {

      const file = input.files[0];

      if (file.type !== 'application/pdf') {

        this.errorFormatFile = true;
        this.selectedFile = null;
      } else {
        this.reports.pop();
        this.reports.push(file);
        this.errorFormatFile = false;
        this.fileReportNameSelected.set(file.name);
      }
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
    this.selectedFile = null;
    this.fileNameSelected.set('');
  }

  deleteReport() {
    this.reportDeleted = true;
    this.fileReportNameSelected.set('');
  }

  downloadReport() {
    if (this.source) {
      this.service.getDownloadReportFile(this.source.oidFuente, true).subscribe(
        {
          next: blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.source!.nombreDocumentoInforme;
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

  downloadFile() {
    if (this.source) {
      this.service.getdownloadSourceFile(this.source.oidFuente).subscribe(
        {
          next: blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.source!.nombreDocumentoFuente;
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
          this.selectedFile = new File([file], this.source!.nombreDocumentoFuente, { type: file.type, lastModified: Date.now() })
        },
        error: error => {
          this.toastr.showErrorMessage('Error al consultar la información', 'Error');
        }
      });
  }

  private recoverySupport(idSource: number) {
    this.service.getDownloadReportFile(idSource, true).subscribe({
      next: data => {
        this.reports.push(new File([data], this.source!.nombreDocumentoInforme, { type: data.type, lastModified: Date.now() }));
      },
      error: error => {
        this.toastr.showErrorMessage('Error al consultar la información', 'Error');
      }
    });
  }

}
