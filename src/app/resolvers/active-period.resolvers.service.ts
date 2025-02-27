import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AcademicPeriodManagementService } from '../modules/academic-period-management/services/academic-period-management-service.service';
import { PeriodoAcademicoResponse } from '../core/models/response/periodo-academico-response.model';

@Injectable({ providedIn: 'root' })
export class ActivePeriodResolvers implements Resolve<any> {

    private activePeriodManagementService: AcademicPeriodManagementService = inject(AcademicPeriodManagementService);

    resolve(): Observable<PeriodoAcademicoResponse> {
        return this.activePeriodManagementService.getActiveAcademicPeriod();
    }

}