import { Component, effect, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { Actividades, ConsolidatedActivitiesResponse, Fuente, InfoActivitie, TeacherInformationResponse } from '../../../../../../core/models/consolidated.interface';
import { CommonModule } from '@angular/common';
import { ViewDetailsSourceOneComponent } from '../view-details-source-one/view-details-source-one.component';
import { ViewDetailsSourceTwoComponent } from '../view-details-source-two/view-details-source-two.component';
import { PaginatorComponent } from "../../../../../../shared/components/paginator/paginator.component";
import { EmailComponent } from '../../../../../../shared/components/email/email.component';
import { User } from '../../../../../../core/models/users.interfaces';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'consolidated-teacher-table',
  standalone: true,
  imports: [
    CommonModule,
    ViewDetailsSourceOneComponent,
    ViewDetailsSourceTwoComponent,
    PaginatorComponent,
    EmailComponent
  ],
  templateUrl: './consolidated-teacher-table.component.html',
  styleUrl: './consolidated-teacher-table.component.css'
})
export class ConsolidatedTeacherTableComponent implements OnInit {


  @ViewChild(ViewDetailsSourceOneComponent)
  viewDetailsSourceOneComponent!: ViewDetailsSourceOneComponent;

  @ViewChild(ViewDetailsSourceTwoComponent)
  viewDetailsSourceTwoComponent!: ViewDetailsSourceTwoComponent;

  @ViewChild(EmailComponent)
  emailComponent: EmailComponent | null = null;

  @Output()
  pageChange: EventEmitter<number> = new EventEmitter<number>();

  @Input()
  teacherOfConsolidated :TeacherInformationResponse | null = null;

  @Input()
  currentPage: number = 1;

  private consolidatedServicesService = inject(ConsolidatedServicesService);
  private router = inject(ActivatedRoute);

  public consolidatedTeacher: ConsolidatedActivitiesResponse | null = null;
  public messageEmail: string = '';
  public subjectEmail: string = '';
  public currentUser: User| null = null;

  constructor() {
    effect(() => {
      this.consolidatedTeacher = this.consolidatedServicesService.getDataConsolidatedTeacher();

    });
  }

  ngOnInit(): void {
    this.currentUser = this.router.snapshot.data['teacher'];
    this.consolidatedTeacher = this.consolidatedServicesService.getDataConsolidatedTeacher();
    
  }



  getObjectKeys(obj: Actividades): string[] {
    if (!obj) {
      return [];
    }
    return Object.keys(obj);

  }


  public emailNotificationModal(activity: InfoActivitie, sourceSelected: Fuente) {
    if (this.emailComponent && activity) {
      this.messageEmail = 
        `Evaluado: ${this.teacherOfConsolidated?.nombreDocente}
Actividad: ${activity.nombre}
Estado fuente: ${sourceSelected.estadoFuente}`;
      this.emailComponent.open(this.messageEmail);
    }
  }

  public viewDetailsSourceModal(oidActividad: number) {
    this.viewDetailsSourceOneComponent.open(oidActividad);
  }

  public viewDetailsSourceTwoModal(oidActividad: number) {
    this.viewDetailsSourceTwoComponent.open(oidActividad);
  }

  getActivities(typeActivity: string): InfoActivitie[] {
    switch (typeActivity) {
      case 'DOCENCIA':
        return this.consolidatedTeacher?.actividades['DOCENCIA'] || [];
      case 'TRABAJO DE INVESTIGACIÓN':
        return this.consolidatedTeacher?.actividades['TRABAJO DE INVESTIGACIÓN'] || [];
      case 'PROYECTO DE INVESTIGACIÓN':
        return this.consolidatedTeacher?.actividades['PROYECTO DE INVESTIGACIÓN'] || [];
      case 'TRABAJO DE DOCENCIA':
        return this.consolidatedTeacher?.actividades['TRABAJO DE DOCENCIA'] || [];
      case 'ADMINISTRACIÓN':
        return this.consolidatedTeacher?.actividades['ADMINISTRACIÓN'] || [];
      case 'ASESORIA':
        return this.consolidatedTeacher?.actividades['ASESORÍA'] || [];
      case 'EXTENSIÓN':
        return this.consolidatedTeacher?.actividades['EXTENSIÓN'] || [];
      case 'CAPACITACIÓN':
        return this.consolidatedTeacher?.actividades['CAPACITACIÓN'] || [];
      case 'OTROS SERVICIOS':
        return this.consolidatedTeacher?.actividades['OTROS SERVICIOS'] || [];

      default:
        return [];
    }
  }

  pageChanged(event: number) {
    this.currentPage = event;
    this.pageChange.emit(this.currentPage);
  }

  activityToSendEmailSelected(activitySelected: InfoActivitie, sourceSelected: Fuente){
    if(activitySelected && sourceSelected)  
    {
      this.emailNotificationModal(activitySelected, sourceSelected);
    }
  }

  recoverUserInfo(idUser:number, userIn:User | null){
    this.consolidatedServicesService.getUserInfo(idUser).subscribe(
        {
          next:User =>{
            userIn = User;
          },
          error: error =>{
            userIn = null;
          }
        }
     );
  }

}
