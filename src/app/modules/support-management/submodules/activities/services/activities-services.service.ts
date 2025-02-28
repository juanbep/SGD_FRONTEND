import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { SmActivitiesServicesService } from '../../../../../core/services/support-management/sm-activities-services.service';
import { PagedResponse } from '../../../../../core/models/response/paged-response.model';
import { ActividadResponse } from '../../../../../core/models/response/actividad-response.model';
import { FuenteCreate } from '../../../../../core/models/modified/fuente-create.model';

@Injectable({providedIn: 'root'})
export class ActivitiesServicesService {

    private userActivities: WritableSignal<PagedResponse<ActividadResponse>| null> = signal(null);
    private paramsActivitiesFilterSignal: WritableSignal<{ nameActivity: string | null, typeActivity: string | null, evaluatorName: string  | null, evaluatorRole:string | null }> = signal({nameActivity: null, typeActivity: null, evaluatorName: null, evaluatorRole: null});

    private smActivitiesServicesService = inject(SmActivitiesServicesService);

    setParamsActivitiesFilterSignal(nameActivity: string | null, typeActivity: string | null, evaluatorName: string  | null, evaluatorRole:string | null) {
        this.paramsActivitiesFilterSignal.update(data => data = {nameActivity, typeActivity, evaluatorName, evaluatorRole}); 
    }

    getParamsActivitiesFilterSignal() {
        return this.paramsActivitiesFilterSignal();
    }


    setDataActivities(newData: PagedResponse<ActividadResponse>) {
        this.userActivities.update(data => data = newData); 
    }

    getDataActivities() {
        return this.userActivities();
    }
    
    getActivities(evaluatedId: number, activityCode: string, activityType: string, evaluatorName: string, roles: string, page: number | null, totalPage:number | null) {
        return this.smActivitiesServicesService.getActivities(evaluatedId, activityCode, activityType, evaluatorName, roles, page, totalPage);    
    }

    saveSelfAssessment(file: File, observation: string, source: FuenteCreate[], reports: File[]) {
        return this.smActivitiesServicesService.saveSelfAssessment(file, observation, source, reports);
    }

    getDownloadSourceFile(idSource: number) {
        return this.smActivitiesServicesService.downloadSourceFile(idSource);
    }
    
    getDownloadReportFile(idSource: number, report:boolean) {
        return this.smActivitiesServicesService.downloadReportFile(idSource, report);
    }


}