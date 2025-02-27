import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { SmResponsibilitiesServicesService } from '../../../../../core/services/support-management/sm-responsibilities-services.service';
import { FuenteCreate } from '../../../../../core/models/modified/fuente-create.model';
import { PagedResponse } from '../../../../../core/models/response/paged-response.model';
import { ResponsabilidadResponse } from '../../../../../core/models/response/responsabilidad-response.model';

@Injectable({ providedIn: 'root' })
export class ResponsibilitiesServicesService {

    private userResponsibilities: WritableSignal<PagedResponse<ResponsabilidadResponse> | null> = signal(null);

    private smResponsibilitiesServicesService = inject(SmResponsibilitiesServicesService);

    setResponsibilitiesData(newData: PagedResponse<ResponsabilidadResponse>) {
        this.userResponsibilities.update(data => data = newData);
    }   

    getResponsibilitiesData() {
        return this.userResponsibilities();
    }

    getResponsibilities(evaluatorId: string, activityCode: string, activityType: string, evaluatorName: string, roles: string, page: number | null, totalPage: number | null) {
        return this.smResponsibilitiesServicesService.getResponsibilities(evaluatorId, activityCode, activityType, evaluatorName, roles, page, totalPage);
    }

    saveResponsibilityEvaluation(file: File, observation: string, source: FuenteCreate[]) {
        return this.smResponsibilitiesServicesService.saveResponsibilityEvaluation(file, observation, source)
    }

    getdownloadSourceFile(idSource: number) {
        return this.smResponsibilitiesServicesService.downloadSourceFile(idSource);
    }

    getDownloadReportFile(idSource: number, report:boolean) {
        return this.smResponsibilitiesServicesService.downloadReportFile(idSource, report);
    }


}
