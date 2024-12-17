import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { EmailNotificationComponent } from '../email-notification/email-notification.component';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';
import { Actividades, Consolidated, InfoActivities } from '../../../../../../core/models/consolidated.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'consolidated-teacher-table',
  standalone: true,
  imports: [
    EmailNotificationComponent,
    CommonModule
  ],
  templateUrl: './consolidated-teacher-table.component.html',
  styleUrl: './consolidated-teacher-table.component.css'
})
export class ConsolidatedTeacherTableComponent implements OnInit{


  @ViewChild(EmailNotificationComponent)
  emailNotificationComponent!: EmailNotificationComponent;

  consolidatedServicesService = inject(ConsolidatedServicesService);

  consolidatedTeacher: Consolidated | null = null;

  constructor() { 
    effect(()=>{
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

  getActivities(typeActivity: string): InfoActivities[] {
    switch (typeActivity) {
      case 'Docencia':
        return this.consolidatedTeacher?.actividades.Docencia || [];
      case 'Trabajos de Investigacion':
        return this.consolidatedTeacher?.actividades['Trabajos de Investigacion'] || [];
      case 'Trabajos Docencia':
        return this.consolidatedTeacher?.actividades['Trabajos Docencia'] || [];
      case 'Trabajos investigación':
        return this.consolidatedTeacher?.actividades['Trabajos investigación'] || [];
      case 'Administración':
        return this.consolidatedTeacher?.actividades.Administración || [];
      case 'Asesoría':
        return this.consolidatedTeacher?.actividades.Asesoría || [];
      case 'Otros servicios':
        return this.consolidatedTeacher?.actividades['Otros servicios'] || [];
      default:
        return [];
    }
  }


}
