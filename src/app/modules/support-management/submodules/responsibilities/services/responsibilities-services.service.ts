import { Injectable, signal, WritableSignal } from '@angular/core';
import { SmResponsibilitiesServicesService } from '../../../../../core/services/supportManagement/sm-responsibilities-services.service';
import { Responsabilidad } from '../../../../../core/models/responsibilitie.interface';
import { SourceEvaluation } from '../../../../../core/models/activities.interface';

@Injectable({ providedIn: 'root' })
export class ResponsibilitiesServicesService {

    private userResponsibilities: WritableSignal<Responsabilidad[]> = signal([]);

    constructor(private service: SmResponsibilitiesServicesService) {

    }

    setResponsibilitiesData(newData: Responsabilidad[]) {
        this.userResponsibilities.update(data => data = newData);
    }   

    getResponsibilitiesData() {
        return this.userResponsibilities();
    }

    getResponsibilities(evaluatorId: string, activityCode: string, activityType: string, evaluatorName: string, roles: string) {
        return this.service.getResponsibilities(evaluatorId, activityCode, activityType, evaluatorName, roles);
    }

    saveResponsibilityEvaluation(file: File, observation: string, source: SourceEvaluation[]) {
        return this.service.saveResponsibilityEvaluation(file, observation, source)
    }

    getdownloadSourceFile(idSource: number) {
        return this.service.downloadSourceFile(idSource);
    }

    getDownloadReportFile(idSource: number, report:boolean) {
        return this.service.downloadReportFile(idSource, report);
    }


}
