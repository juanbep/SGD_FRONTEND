import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { SmActivitiesServicesService } from '../../../../../core/services/support-management/sm-activities-services.service';
import { PagedResponse } from '../../../../../core/models/response/paged-response.model';
import { ActividadResponse } from '../../../../../core/models/response/actividad-response.model';
import { FuenteCreate } from '../../../../../core/models/modified/fuente-create.model';
import { AutoevaluacionFuente } from '../../../../../core/models/modified/autoevaluacion-fuente.model';
import { UmUsersServicesService } from '../../../../../core/services/users-management/um-users-services.service';
import { FuenteAutoevaluacion } from '../../../../../core/models/modified/fuente-autoevaluacion.model';

@Injectable({ providedIn: 'root' })
export class ActivitiesServicesService {
  private userActivities: WritableSignal<PagedResponse<ActividadResponse> | null> =
    signal(null);
  private paramsActivitiesFilterSignal: WritableSignal<{
    activityName: string | null;
    activityType: string | null;
    evaluatorName: string | null;
    evaluatorRole: string | null;
  }> = signal({
    activityName: null,
    activityType: null,
    evaluatorName: null,
    evaluatorRole: null,
  });

  private smActivitiesServicesService = inject(SmActivitiesServicesService);

  private umUsersServicesService = inject(UmUsersServicesService);
  

  setParamsActivitiesFilterSignal(
    activityName: string | null,
    activityType: string | null,
    evaluatorName: string | null,
    evaluatorRole: string | null
  ) {
    this.paramsActivitiesFilterSignal.update(
      (data) =>
        (data = { activityName, activityType, evaluatorName, evaluatorRole })
    );
  }

  getParamsActivitiesFilterSignal() {
    return this.paramsActivitiesFilterSignal();
  }

  setDataActivities(newData: PagedResponse<ActividadResponse>) {
    this.userActivities.update((data) => (data = newData));
  }

  getDataActivities() {
    return this.userActivities();
  }

  getActivities(
    evaluatedId: number,
    activityName: string | null,
    activityType: string | null,
    evaluatorName: string | null,
    roles: string | null,
    page: number | null,
    totalPage: number | null
  ) {
    return this.smActivitiesServicesService.getActivities(
      evaluatedId,
      activityName,
      activityType,
      evaluatorName,
      roles,
      page,
      totalPage
    );
  }

  getActivityById(activityId: number) {
    return this.smActivitiesServicesService.getActivityById(activityId);
  }

  saveSelfAssessment(
    file: File,
    observation: string,
    source: FuenteCreate[],
    reports: File[]
  ) {
    return this.smActivitiesServicesService.saveSelfAssessment(
      file,
      observation,
      source,
      reports
    );
  }

  getDownloadSourceFile(idSource: number) {
    return this.smActivitiesServicesService.downloadSourceFile(idSource);
  }

  getDownloadReportFile(idSource: number, report: boolean) {
    return this.smActivitiesServicesService.downloadReportFile(
      idSource,
      report
    );
  }

  saveSelfAssessmentByForm(autoevaluacionFuente: FuenteAutoevaluacion, evidences: File[], signature:File, support: File) {
    return this.smActivitiesServicesService.saveSelfAssessmentForm(
      autoevaluacionFuente,
      evidences,
      signature,
      support
    );
  }

  getUserById(userId: number){
    return this.umUsersServicesService.getUserbyId(userId);
}
}
