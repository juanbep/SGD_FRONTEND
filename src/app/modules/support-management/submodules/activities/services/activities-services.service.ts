import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ActivityResponse, SourceEvaluation } from '../../../../../core/models/activities.interface';
import { SmActivitiesServicesService } from '../../../../../core/services/support-management/sm-activities-services.service';

@Injectable({providedIn: 'root'})
export class ActivitiesServicesService {

    private userActivities: WritableSignal<ActivityResponse| null> = signal(null);

    private smActivitiesServicesService = inject(SmActivitiesServicesService);


    setDataActivities(newData: ActivityResponse)  {
        this.userActivities.update(data => data = newData); 
    }

    getDataActivities() {
        return this.userActivities();
    }
    
    getActivities(evaluatedId: string, activityCode: string, activityType: string, evaluatorName: string, roles: string, page: number | null, totalPage:number | null) {
        return this.smActivitiesServicesService.getActivities(evaluatedId, activityCode, activityType, evaluatorName, roles, page, totalPage);    
    }

    saveSelfAssessment(file: File, observation: string, source: SourceEvaluation[], reports: File[]) {
        return this.smActivitiesServicesService.saveSelfAssessment(file, observation, source, reports);
    }

    getdownloadSourceFile(idSource: number) {
        return this.smActivitiesServicesService.downloadSourceFile(idSource);
    }
    
    getDownloadReportFile(idSource: number, report:boolean) {
        return this.smActivitiesServicesService.downloadReportFile(idSource, report);
    }


}