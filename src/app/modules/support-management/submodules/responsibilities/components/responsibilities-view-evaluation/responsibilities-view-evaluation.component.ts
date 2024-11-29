import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { Actividad, Fuente } from '../../../../../../core/models/activities.interface';
import { Responsabilidad } from '../../../../../../core/models/responsibilitie.interface';
import { CommonModule } from '@angular/common';
import { ResponsibilitiesServicesService } from '../../services/responsibilities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';

@Component({
  selector: 'responsibilities-view-evaluation',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './responsibilities-view-evaluation.component.html',
  styleUrl: './responsibilities-view-evaluation.component.css'
})
export class ResponsibilitiesViewEvaluationComponent {
  @Input()
  public source: Fuente | null = null;

  @Input()
  public activity: Actividad | null = null;

  @Input()
  public responsability: Responsabilidad | null = null;

  @Input()
  public openModalSelected: boolean = false;

  @Output()
  public closeModalSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
  

  private myModal: HTMLElement | null = null;

  public evaluation: string = '';

  public observation: string = "";

  public documentName: string = "";

  public editSelected: WritableSignal<boolean> = signal(false);

  constructor(private service: ResponsibilitiesServicesService, private toastr: MessagesInfoService) { }

  ngAfterViewInit () {
    if(this.openModalSelected){
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
