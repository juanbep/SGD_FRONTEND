import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { PaginatorComponent } from "../../../../../../shared/components/paginator/paginator.component";
import { CommonModule } from '@angular/common';
import { ActivitiesManagementService } from '../../services/activities-management.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Activity, ActivityResponse } from '../../../../../../core/models/activities.interface';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ModalActivitieDetailsComponent } from '../modal-activitie-details/modal-activitie-details.component';

@Component({
  selector: 'user-management-activities-activities-table',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent,
    ModalActivitieDetailsComponent,
    RouterModule
],
  templateUrl: './activities-table.component.html',
  styleUrls: ['./activities-table.component.css']
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
  public sizePage: number = 10;

  public filterParams: {nameActivity: string | null, typeActivity: string | null, activityCode: string | null, administrativeCode: string | null, vriCode: string | null} | null = null;

  activitiesEffect = effect(()=>{
    this.filterParams=this.activitiesManagementService.getParamsActivitiesFilter();
    this.currentPage = 1;
    this.recoverActivitiesByUser(this.currentPage, this.sizePage);
  })

  ngOnInit(): void {
    this.idUserParam = this.activitieRouter.snapshot.params['id'];
  }

  pageChanged(event: number) {
    this.currentPage = event;
    this.recoverActivitiesByUser(this.currentPage, this.sizePage);
  }

  openActivitieDetails(activity: Activity){
    if(this.modalActivitieDetails){
      this.modalActivitieDetails.open(activity);
    }
  }

  recoverActivitiesByUser(page: number, size: number) {
    const { nameActivity = '', typeActivity = '', activityCode = '', administrativeCode = '', vriCode = '' } = this.filterParams || {};
    if (this.idUserParam) {
      this.activitiesManagementService.getActivitiesByParams(page-1, size, this.idUserParam, nameActivity, typeActivity, activityCode, administrativeCode, vriCode).subscribe(
        {
          next: (response) => {
            this.activityResponse = response;
            if (this.activityResponse && this.activityResponse.content) {
              this.activities = this.activityResponse.content;
            }
          },
          error: (error) => {
            this.messageToast.showErrorMessage('Error al recuperar las actividades del usuario', 'Error');
            this.filterParams = null;
          }
        }
      );
    }
  }



}
