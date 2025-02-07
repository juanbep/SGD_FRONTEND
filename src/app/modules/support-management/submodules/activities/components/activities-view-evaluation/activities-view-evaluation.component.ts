import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { Activity, Fuente } from '../../../../../../core/models/activities.interface';
import { Responsability } from '../../../../../../core/models/responsibilitie.interface';
import { CommonModule } from '@angular/common';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';

@Component({
  selector: 'activities-view-evaluation',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './activities-view-evaluation.component.html',
  styleUrl: './activities-view-evaluation.component.css'
})
export class ActivitiesViewEvaluationComponent {
  @Input()
  public source: Fuente | null = null;

  @Input()
  public activity: Activity | null = null;

  @Input()
  public responsability: Responsability | null = null;

  @Input()
  public openModalSelected: boolean = false;

  @Output()
  public closeModalSelected: EventEmitter<boolean> = new EventEmitter<boolean>();


  private myModal: HTMLElement | null = null;

  public evaluation: string = '';

  public observation: string | undefined = "";

  public documentName: string | undefined = "";

  public reportName: string | undefined = "";

  public editSelected: WritableSignal<boolean> = signal(false);

  public sourceOne: Fuente | null = null;

  public sourceTwo: Fuente | null = null;

  constructor(private service: ActivitiesServicesService, private toastr: MessagesInfoService) { }

  ngAfterViewInit() {
    if (this.openModalSelected) {
      this.myModal = document.getElementById("myModalDownload");
    }

    if (this.myModal) {
      this.myModal.style.display = "flex";
    }
  }

  ngOnInit(): void {
    if (this.source) {
      this.documentName = this.source.nombreDocumentoFuente;
      this.evaluation = this.source.calificacion.toFixed(1);
      this.observation = this.source.observacion;
      this.reportName = this.source.nombreDocumentoInforme;
    }
  }

  downloadReport(){
    if (this.source) {
      this.service.getDownloadReportFile(this.source.oidFuente, true).subscribe(
        {
          next: blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.source!.nombreDocumentoInforme || 'default-report-name';
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
            a.download = this.source!.nombreDocumentoFuente || 'default-document-name';
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

  closeModal() {
    if (this.myModal) {
      this.myModal.style.display = "none";
      this.closeModalSelected.emit(true);
      this.documentName = '';
      this.evaluation = '';
      this.observation = '';
    }
  }
}
