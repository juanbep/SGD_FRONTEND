import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ApmAcademicPeriodManagementService } from '../../../../../core/services/academic-period-management/apm-academic-period-management-service.service';
import { SmConsolidatedServicesService } from '../../../../../core/services/support-management/sm-consolidated-services.service';
import { UmUsersServicesService } from '../../../../../core/services/users-management/um-users-services.service';

@Injectable({ providedIn: 'root' })
export class HistoricalServices {

    private smConsolidatedServicesService = inject(SmConsolidatedServicesService);
    private apmAcademicPeriodManagementService = inject(ApmAcademicPeriodManagementService);
    private umUsersServicesService = inject(UmUsersServicesService);

    private filterTeacherParams: WritableSignal<{
        evaluatedName: string | null;
        evaluatedId: string | null;
        category: string | null;
        department: string | null;
    }> = signal({ evaluatedName: null, evaluatedId: null, category: null, department: null });

    
    setFilterTeacherParams(newData: {
        evaluatedName: string | null;
        evaluatedId: string | null;
        category: string | null;
        department: string | null;
    }) {
        this.filterTeacherParams.update((data) => (data = newData));
    }

    getFilterTeacherParams() {
        return this.filterTeacherParams();
    }


    historicalConsolidated(page: number, totalPage: number, academicPeriodsId: number[], evaluatedName: string | null, contractType: string | null, evaluatedId: string | null) {
        return this.smConsolidatedServicesService.historicalConsolidated(page, totalPage, academicPeriodsId, evaluatedName, contractType, evaluatedId);
    }

    getAllAcademicPeriods(page: number, size: number) {
        return this.apmAcademicPeriodManagementService.getAllAcademicPeriods(page, size);
    }

    getUserById(id: number) {   
        return this.umUsersServicesService.getUserbyId(id);
    }

}