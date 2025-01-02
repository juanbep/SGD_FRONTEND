import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { SmResponsibilitiesServicesService } from '../../../../../core/services/support-management/sm-responsibilities-services.service';
import { ResponsabilityResponse } from '../../../../../core/models/responsibilitie.interface';
import { SourceEvaluation } from '../../../../../core/models/activities.interface';

@Injectable({ providedIn: 'root' })
export class ResponsibilitiesServicesService {

    private userResponsibilities: WritableSignal<ResponsabilityResponse | null> = signal(null);

    private smResponsibilitiesServicesService = inject(SmResponsibilitiesServicesService);

    setResponsibilitiesData(newData: ResponsabilityResponse) {
        this.userResponsibilities.update(data => data = newData);
    }   

    getResponsibilitiesData() {
        return this.userResponsibilities();
    }

    getResponsibilities(evaluatorId: string, activityCode: string, activityType: string, evaluatorName: string, roles: string, page: number | null, totalPage: number | null) {
        return this.smResponsibilitiesServicesService.getResponsibilities(evaluatorId, activityCode, activityType, evaluatorName, roles, page, totalPage);
    }

    saveResponsibilityEvaluation(file: File, observation: string, source: SourceEvaluation[]) {
        return this.smResponsibilitiesServicesService.saveResponsibilityEvaluation(file, observation, source)
    }

    getdownloadSourceFile(idSource: number) {
        return this.smResponsibilitiesServicesService.downloadSourceFile(idSource);
    }

    getDownloadReportFile(idSource: number, report:boolean) {
        return this.smResponsibilitiesServicesService.downloadReportFile(idSource, report);
    }


}
