import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { ActivitiesPendingDefinitionEvaluatorServicesService } from '../../services/activities-pending-definition-evaluator-services.service';
import { AuthServiceService } from '../../../../../auth/service/auth-service.service';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { ActividadResponse } from '../../../../../../core/models/response/actividad-response.model';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { ResponsabilidadResponse } from '../../../../../../core/models/response/responsabilidad-response.model';
import { PaginatorComponent } from "../../../../../../shared/components/paginator/paginator.component";
import { RouterLink } from '@angular/router';

const PAGE_SIZE = 10;

@Component({
  selector: 'activities-pending-definition-evaluator-table',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent,
    RouterLink
],
  templateUrl: './activities-pending-definition-evaluator-table.component.html',
  styleUrl: './activities-pending-definition-evaluator-table.component.css'
})
export class ActivitiesPendingDefinitionEvaluatorTableComponent {

  private activitiesPendingDefinitionEvaluatorService = inject(ActivitiesPendingDefinitionEvaluatorServicesService);

  private authService = inject(AuthServiceService)

  public responsabilities: PagedResponse<ResponsabilidadResponse> | null = null;

  public currentUser: UsuarioResponse | null = null;
  public currentPage: number = 1;

  public filterParams: { activityName: string | null, activityType: string | null, evaluatedName: string | null, evaluatedRole: string | null } | null = null;

  activitiesEffect = effect(() => {
    this.filterParams = this.activitiesPendingDefinitionEvaluatorService.getParamsActivitiesFilter();
    this.currentPage = 1;
    this.recoverActivities(this.currentPage, PAGE_SIZE);
  })

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.activitiesPendingDefinitionEvaluatorService.setParamsActivitiesFilterSignal(
      {
        activityName: null,
        activityType: null,
        evaluatedName: null,
        evaluatedRole: null
      }
    );
  }

  recoverActivities(page: number, size: number) {
    this.activitiesPendingDefinitionEvaluatorService.getResponsibilities(
      this.currentUser?.oidUsuario.toString() || '',
      this.filterParams?.activityName || null,
      this.filterParams?.activityType || null,
      this.filterParams?.evaluatedName || null,
      this.filterParams?.evaluatedRole || null,
      true,
      page-1,
      size
    ).subscribe((response) => {
      this.responsabilities = response.data;
    });
  }

  pageChange(event: number) {
    this.currentPage = event;
    this.recoverActivities(this.currentPage, PAGE_SIZE);
  }

}
