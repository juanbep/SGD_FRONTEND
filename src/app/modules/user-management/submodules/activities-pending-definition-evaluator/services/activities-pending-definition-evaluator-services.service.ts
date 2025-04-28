import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { SmResponsibilitiesServicesService } from '../../../../../core/services/support-management/sm-responsibilities-services.service';

@Injectable({ providedIn: 'root' })
export class ActivitiesPendingDefinitionEvaluatorServicesService {

    private smResponsibilitiesServicesService = inject(SmResponsibilitiesServicesService);

    private paramsActivitiesFilterSignal: WritableSignal<{ activityName: string | null, activityType: string | null, evaluatedName: string | null, evaluatedRole: string | null }> = signal({ activityName: null, activityType: null, evaluatedName: null, evaluatedRole: null });

    setParamsActivitiesFilterSignal(newData: {activityName: string | null, activityType: string | null, evaluatedName: string | null, evaluatedRole: string | null}) {
        this.paramsActivitiesFilterSignal.update(data => data = newData);
    }

    /*
    * Method to get the params filter signal
    * @returns {nameActivity:string, date:string, state:string} | null
    * */
    getParamsActivitiesFilter() {
        return this.paramsActivitiesFilterSignal();
    }



    getResponsibilities(evaluatorId: string, activityName: string | null, activityType: string | null, evaluatorName: string | null, roles: string | null, asignacionDefault: boolean, page: number | null, totalPage: number | null) {
        return this.smResponsibilitiesServicesService.getResponsibilities(evaluatorId, activityName, activityType, evaluatorName, roles, asignacionDefault, page, totalPage);
    }

}