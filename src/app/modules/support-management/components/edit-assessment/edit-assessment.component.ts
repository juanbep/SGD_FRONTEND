import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { Actividad, Fuente, SourceEvaluation } from '../../../../core/activities.interface';
import { Responsabilidad } from '../../../../core/responsabilitie.interface';
import { SupportManagementService } from '../../services/support-management.service';
import { SupportManagementResponsabilitiesService } from '../../services/support-management-responabilities.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'support-management-edit-assessment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
    
  ],
  templateUrl: './edit-assessment.component.html',
  styleUrl: './edit-assessment.component.css'
})
export class EditAssessmentComponent {

  @Input()
  source: Fuente | null = null;

  @Input()
  public activity: Actividad | null = null;

  @Input()
  public responsability: Responsabilidad | null = null;

  @Input()
  public openModalSelected: boolean = false;

  @Output()
  public closeModalEditSelected:  EventEmitter<boolean> = new EventEmitter<boolean>();

  private myModal: HTMLElement | null = null;
  public errorFormatFile: boolean = false;
  public errorEvaluation: boolean = false;
  public evaluation: string = '';
  public observation: string = '';
  public fileName: string = '';
  public fileNameSelected: WritableSignal<string> = signal('');
  public selectedFile: File | null = null;
  public fileDeleted: boolean = false;


  constructor(
    private supportManagementService: SupportManagementService, 
    private supportManagementResponsabilitiesService: SupportManagementResponsabilitiesService ) 
  { }

  ngAfterViewInit () {
    if(this.openModalSelected){
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
      this.getFilebyName();
    }
  }

  public updateSource(){
    let sendSource: SourceEvaluation[] = [];
    console.log(this.source);
    console.log(this.activity);
    if(this.source  && this.selectedFile){
      if(this.source.tipoFuente==='1' && this.activity){
        sendSource=[{
          tipoFuente: "1",
          calificacion: parseFloat(this.evaluation),
          oidActividad: this.activity.oidActividad,
          informeEjecutivo: ''
        }]
        this.supportManagementService.sendActivities(this.selectedFile, this.observation, sendSource,[]);
        this.closeModal();
      }else if(this.source.tipoFuente==='2' && this.responsability){
        sendSource=[{
          tipoFuente: "2",
          calificacion: parseFloat(this.evaluation),
          oidActividad: this.responsability.oidActividad,
          informeEjecutivo: ''
        }]
        this.supportManagementResponsabilitiesService.sendEvaluationResponsabilities(this.selectedFile, this.observation, sendSource);
        this.closeModalEditSelected.emit(true);
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {

      const file = input.files[0];
      console.log(file.type);

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
    console.log(this.myModal);
    if (this.myModal) {
      this.myModal.style.display = "none";
      this.closeModalEditSelected.emit(true);

    }
  }


  getInputClass(){
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

  saveEvaluation(){
    this.updateSource();
  }

  deleteFile(){
    this.fileDeleted = true;
    this.fileNameSelected.set('');
  }

  downloadFile(){
    if(this.source){
      this.supportManagementResponsabilitiesService.downloadFileSource(this.source.oidFuente).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.source!.nombreDocumentoFuente;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
    }
  }

  private getFilebyName(){
    this.supportManagementResponsabilitiesService.downloadFileSource(this.source!.oidFuente).subscribe(file => {
      this.selectedFile = new File([file], this.source!.nombreDocumentoFuente, { type: file.type, lastModified: Date.now() })
    });
  }

  
}

