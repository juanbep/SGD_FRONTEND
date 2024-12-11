import { Injectable, signal, WritableSignal } from '@angular/core';
import { SmActivitiesServicesService } from '../../../../../core/services/supportManagement/sm-activities-services.service';
import { Actividad, SourceEvaluation } from '../../../../../core/models/activities.interface';

@Injectable({providedIn: 'root'})
export class ActivitiesServicesService {

    private userActivities: WritableSignal<Actividad[]> = signal([]);

    constructor(private service: SmActivitiesServicesService) { }

    setDataActivities(newData: Actividad[])  {
        this.userActivities.update(data => data = newData); 
    }

    getDataActivities() {
        return this.userActivities();
    }
    
    getActivities(evaluatedId: string, activityCode: string, activityType: string, evaluatorName: string, roles: string) {
        return this.service.getActivities(evaluatedId, activityCode, activityType, evaluatorName, roles);    
    }

    saveSelfAssessment(file: File, observation: string, source: SourceEvaluation[], reports: File[]) {
        return this.service.saveSelfAssessment(file, observation, source, reports);
    }

    getdownloadSourceFile(idSource: number) {
        return this.service.downloadSourceFile(idSource);
    }
    
    getDownloadReportFile(idSource: number, report:boolean) {
        return this.service.downloadReportFile(idSource, report);
    }


}