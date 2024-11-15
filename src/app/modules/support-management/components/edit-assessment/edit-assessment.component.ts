import { Component, Input } from '@angular/core';
import { Actividad, Fuente, SourceEvaluation } from '../../../../core/activities.interface';
import { Responsabilidad } from '../../../../core/responsabilitie.interface';
import { SupportManagementService } from '../../services/support-management.service';
import { SupportManagementResponsabilitiesService } from '../../services/support-management-responabilities.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'support-management-edit-assessment',
  standalone: true,
  imports: [
    CommonModule
    
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


  public evaluation: number = 0;

  public observation: string = "";

  public selectedFile: File | null = null;

  public errorFormatFile: boolean = false;

  private myModal: HTMLElement | null = null;


  constructor(
    private supportManagementService: SupportManagementService, 
    private supportManagementResponsabilitiesService: SupportManagementResponsabilitiesService ) 
  { }

  ngAfterViewInit () {
    console.log("Entro a edit-assessment");
    if(this.openModalSelected){
      this.myModal = document.getElementById("myModalEdit");
      if (this.myModal) {
        this.myModal.style.display = "flex";
      }
    }
  }

  ngOnInit(): void {
    
   

    if (this.source) {
      this.evaluation = this.source.calificacion;
      this.observation = this.source.observacion;
    }
  }

  public updateSource(){
    let sendSource: SourceEvaluation[] = [];
    if(this.source  && this.selectedFile){
      if(this.source.tipoFuente==='1' && this.activity){
        sendSource=[{
          tipoFuente: "1",
          calificacion: this.evaluation,
          oidActividad: this.activity.oidActividad,
        }]
        this.supportManagementService.sendActivities(this.selectedFile, this.observation, sendSource);
      }else if(this.source.tipoFuente==='2' && this.responsability){
        sendSource=[{
          tipoFuente: "2",
          calificacion: this.evaluation,
          oidActividad: this.responsability.oidActividad,
        }]
        this.supportManagementResponsabilitiesService.sendEvaluationResponsabilities(this.selectedFile, this.observation, sendSource);
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
      }
    }
  }
  closeModal() {
    console.log(this.myModal);
    if (this.myModal) {
      this.myModal.style.display = "none";

    }
  }
  
}
