import { inject, Injectable } from '@angular/core';
import { ApmAcademicPeriodManagementService } from '../../../../../core/services/academic-period-management/apm-academic-period-management-service.service';
import { SmConsolidatedServicesService } from '../../../../../core/services/support-management/sm-consolidated-services.service';

@Injectable({ providedIn: 'root' })
export class HistoricalServices {
    
    private smConsolidatedServicesService = inject(SmConsolidatedServicesService);
    private apmAcademicPeriodManagementService = inject(ApmAcademicPeriodManagementService);

    historicalConsolidated(page: number, totalPage:number, academicPeriodsId: number[]) {
        return this.smConsolidatedServicesService.historicalConsolidated(page, totalPage, academicPeriodsId);
    }
    
    getAllAcademicPeriods(page: number, size: number) {
        return this.apmAcademicPeriodManagementService.getAllAcademicPeriods(page, size);
    }

}