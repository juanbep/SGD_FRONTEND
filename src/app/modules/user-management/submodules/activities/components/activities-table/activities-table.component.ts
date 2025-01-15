import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { PaginatorComponent } from "../../../../../../shared/components/paginator/paginator.component";
import { CommonModule } from '@angular/common';
import { ActivitiesManagementService } from '../../services/activities-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity, ActivityResponse } from '../../../../../../core/models/activities.interface';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ModalActivitieDetailsComponent } from '../modal-activitie-details/modal-activitie-details.component';

@Component({
  selector: 'user-management-activities-activities-table',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent,
    ModalActivitieDetailsComponent
],
  templateUrl: './activities-table.component.html',
  styleUrl: './activities-table.component.css'
})
export class ActivitiesTableComponent implements OnInit {

  @ViewChild(ModalActivitieDetailsComponent) modalActivitieDetails: ModalActivitieDetailsComponent | undefined;

  private activitiesManagementService: ActivitiesManagementService = inject(ActivitiesManagementService);
  private activitieRouter = inject(ActivatedRoute);
  private messageToast = inject(MessagesInfoService);

  public idUserParam: number | null = null;
  public activityResponse: ActivityResponse | null = null;
  public activities: Activity[] = [];
  public currentPage: number = 1;

  ngOnInit(): void {
    this.idUserParam = this.activitieRouter.snapshot.params['id'];
    this.recoverActivitiesByUser(this.currentPage, 2);
  }

  pageChanged(event: any) {
    this.currentPage = event;
    this.recoverActivitiesByUser(this.currentPage, 2);
  }

  openActivitieDetails(activity: Activity){
    if(this.modalActivitieDetails){
      this.modalActivitieDetails.open(activity);
    }
  }

  recoverActivitiesByUser(page: number, size: number) {
    if (this.idUserParam) {
      this.activitiesManagementService.getActivitiesByUser(page-1, size, this.idUserParam).subscribe(
        {
          next: (response) => {
            this.activityResponse = response;
            if (this.activityResponse && this.activityResponse.content) {
              this.activities = this.activityResponse.content;
            }
          },
          error: (error) => {
            this.messageToast.showErrorMessage('Error al recuperar las actividades del usuario', 'Error');
          }
        }
      );
    }
  }


}
