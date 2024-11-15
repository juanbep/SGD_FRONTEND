import { Component, Input, OnInit, Output, EventEmitter, signal, WritableSignal } from '@angular/core';
import { Actividad, Fuente } from '../../../../core/activities.interface';
import { SupportManagementResponsabilitiesService } from '../../services/support-management-responabilities.service';
import { Responsabilidad } from '../../../../core/responsabilitie.interface';
import { CommonModule } from '@angular/common';
import { EditAssessmentComponent } from '../edit-assessment/edit-assessment.component';

@Component({
  selector: 'support-management-download-file',
  standalone: true,
  imports: [
    CommonModule, EditAssessmentComponent
  ],
  templateUrl: './download-file.component.html',
  styleUrl: './download-file.component.css'
})
export class DownloadFileComponent implements OnInit {

  @Input()
  public fuente: Fuente | null = null;

  @Input()
  public activity: Actividad | null = null;

  @Input()
  public responsability: Responsabilidad | null = null;

  @Input()
  public openModalSelected: boolean = false;

  @Output()
  public closeModalSelected: EventEmitter<boolean> = new EventEmitter<boolean>();
  

  private myModal: HTMLElement | null = null;

  public evaluation: number = 0;

  public observation: string = "";

  public documentName: string = "";

  public editSelected: WritableSignal<boolean> = signal(false);

  constructor(private service: SupportManagementResponsabilitiesService) { }

  ngAfterViewInit () {
    if(this.openModalSelected){
      this.myModal = document.getElementById("myModalDownload");
    }

    if (this.myModal) {
      this.myModal.style.display = "flex";
    }
  }
  
  ngOnInit(): void {
    if (this.fuente) {
      this.documentName = this.fuente.nombreDocumento;
      this.evaluation = this.fuente.calificacion;
      this.observation = this.fuente.observacion;
      
    }
  }
  downloadFile() {
    if(this.fuente){
      this.service.downloadFileSource(this.fuente.oidFuente).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.fuente!.nombreDocumento;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
    } 
  }

  closeModal() {
    console.log(this.myModal);
    if (this.myModal) {
      this.myModal.style.display = "none";
      this.closeModalSelected.emit(true);
      this.documentName = '';
      this.evaluation = 0;
      this.observation = '';
    }
  }
}
