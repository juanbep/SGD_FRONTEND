import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { EmailNotificationComponent } from '../email-notification/email-notification.component';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { Actividades, ConsolidatedActivitiesResponse, Fuente, InfoActivitie } from '../../../../../../core/models/consolidated.interface';
import { CommonModule } from '@angular/common';
import { ViewDetailsSourceOneComponent } from '../view-details-source-one/view-details-source-one.component';
import { ViewDetailsSourceTwoComponent } from '../view-details-source-two/view-details-source-two.component';

@Component({
  selector: 'consolidated-teacher-table',
  standalone: true,
  imports: [
    EmailNotificationComponent,
    CommonModule,
    ViewDetailsSourceOneComponent,
    ViewDetailsSourceTwoComponent
  ],
  templateUrl: './consolidated-teacher-table.component.html',
  styleUrl: './consolidated-teacher-table.component.css'
})
export class ConsolidatedTeacherTableComponent implements OnInit {


  @ViewChild(EmailNotificationComponent)
  emailNotificationComponent!: EmailNotificationComponent;

  @ViewChild(ViewDetailsSourceOneComponent)
  viewDetailsSourceOneComponent!: ViewDetailsSourceOneComponent;

  @ViewChild(ViewDetailsSourceTwoComponent)
  viewDetailsSourceTwoComponent!: ViewDetailsSourceTwoComponent;

  consolidatedServicesService = inject(ConsolidatedServicesService);

  consolidatedTeacher: ConsolidatedActivitiesResponse | null = null;

  constructor() {
    effect(() => {
      this.consolidatedTeacher = this.consolidatedServicesService.getDataConsolidatedTeacher();

    });
  }

  ngOnInit(): void {
    this.consolidatedTeacher = this.consolidatedServicesService.getDataConsolidatedTeacher();
  }



  getObjectKeys(obj: Actividades): string[] {
    if (!obj) {
      return [];
    }
    return Object.keys(obj);

  }


  public emailNotificationModal() {
    this.emailNotificationComponent.openModal();
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


}
