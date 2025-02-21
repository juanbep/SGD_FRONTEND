import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AcademicPeriod } from '../core/models/academicPeriods';
import { AcademicPeriodManagementService } from '../modules/academic-period-management/services/academic-period-management-service.service';

@Injectable({ providedIn: 'root' })
export class ActivePeriodResolvers implements Resolve<any> {

    private activePeriodManagementService: AcademicPeriodManagementService = inject(AcademicPeriodManagementService);

    resolve(): Observable<AcademicPeriod> {
        return this.activePeriodManagementService.getActiveAcademicPeriod();
    }

}