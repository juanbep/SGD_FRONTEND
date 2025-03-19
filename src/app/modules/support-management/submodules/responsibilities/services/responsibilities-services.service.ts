import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { SmResponsibilitiesServicesService } from '../../../../../core/services/support-management/sm-responsibilities-services.service';
import { FuenteCreate } from '../../../../../core/models/modified/fuente-create.model';
import { PagedResponse } from '../../../../../core/models/response/paged-response.model';
import { ResponsabilidadResponse } from '../../../../../core/models/response/responsabilidad-response.model';
import { SmActivitiesServicesService } from '../../../../../core/services/support-management/sm-activities-services.service';
import { UmUsersServicesService } from '../../../../../core/services/users-management/um-users-services.service';
import { FuenteEstudianteFormulario } from '../../../../../core/models/modified/fuente-estudiante-formulario.model';

@Injectable({ providedIn: 'root' })
export class ResponsibilitiesServicesService {

    private userResponsibilities: WritableSignal<PagedResponse<ResponsabilidadResponse> | null> = signal(null);
    private paramsActivitiesFilterSignal: WritableSignal<{ activityName: string | null, activityType: string | null, evaluatorName: string | null, evaluatorRole: string | null }> = signal({ activityName: null, activityType: null, evaluatorName: null, evaluatorRole: null });

    private smResponsibilitiesServicesService = inject(SmResponsibilitiesServicesService);
    
    private smActivitiesServicesService = inject(SmActivitiesServicesService);

    private umUsersServicesService = inject(UmUsersServicesService);

    setParamsActivitiesFilterSignal(activityName: string | null, activityType: string | null, evaluatorName: string | null, evaluatorRole: string | null) {
        this.paramsActivitiesFilterSignal.update(data => data = { activityName, activityType, evaluatorName, evaluatorRole });
    }
    
    getParamsActivitiesFilterSignal() {
        return this.paramsActivitiesFilterSignal();
    }
    
    setResponsibilitiesData(newData: PagedResponse<ResponsabilidadResponse>) {
        this.userResponsibilities.update(data => data = newData);
    }   
    
    getResponsibilitiesData() {
        return this.userResponsibilities();
    }

    getUserById(userId: number){
        return this.umUsersServicesService.getUserbyId(userId);
    }
    
    getResponsibilitieById(responsibilitieId:number){
        return this.smActivitiesServicesService.getActivityById(responsibilitieId);
    }

    getResponsibilities(evaluatorId: string, activityName: string | null, activityType: string | null, evaluatorName: string | null, roles: string | null, page: number | null, totalPage: number | null) {
        return this.smResponsibilitiesServicesService.getResponsibilities(evaluatorId, activityName, activityType, evaluatorName, roles, page, totalPage);
    }

    saveResponsibilityEvaluation(file: File, observation: string, source: FuenteCreate[]) {
        return this.smResponsibilitiesServicesService.saveResponsibilityEvaluation(file, observation, source)
    }

    saveResponibilityFormStundent(fuenteEstudianteFormulario: FuenteEstudianteFormulario, reportDocument: File,  signature: File) {
        return this.smResponsibilitiesServicesService.saveResponibilityFormStundent(fuenteEstudianteFormulario, reportDocument, signature);
    }

    getdownloadSourceFile(idSource: number) {
        return this.smResponsibilitiesServicesService.downloadSourceFile(idSource);
    }

    getDownloadReportFile(idSource: number, report:boolean) {
        return this.smResponsibilitiesServicesService.downloadReportFile(idSource, report);
    }

    


}
