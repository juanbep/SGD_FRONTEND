import { inject, Injectable } from '@angular/core';
import { StatisticsManagementServicesService } from '../../../../../core/services/statistics-management/statistics-management-services.service';
import { UmUsersServicesService } from '../../../../../core/services/users-management/um-users-services.service';
import { ApmAcademicPeriodManagementService } from '../../../../../core/services/academic-period-management/apm-academic-period-management-service.service';

@Injectable({providedIn: 'root'})
export class StatisticsService {

    statisticsManagementServicesService = inject(StatisticsManagementServicesService);
    umUserManagementService = inject(UmUsersServicesService);
    apmAcademicPeriodManagementService = inject(ApmAcademicPeriodManagementService);

    getActivityEvaluationComparison(idUser:number, academicPeriodId:number, activityTypeId: number | null) {
        return this.statisticsManagementServicesService.getActivityEvaluationComparison(idUser, academicPeriodId, activityTypeId);
    }

    getAverageEvaluationByDepartment(academicPeriodId: number) {
        return this.statisticsManagementServicesService.getAverageEvaluationDepartment(academicPeriodId);
    }

    getUserByParams(page: number, totalPage: number, userId: string | null, userName:string | null, faculty: string | null, department: string | null, category: string | null, hiring: string | null, dedication: string | null, studies: string | null, rol: string | null, state: string | null){
        return this.umUserManagementService.getAllUsersByParams(page, totalPage, userId, userName, faculty, department, category, hiring, dedication, studies, rol, state);
    }
    
    getEvolutionAverageEvaluationDepartment(academicPeriodsId:string[], departmentId: string) {
        return this.statisticsManagementServicesService.getEvolutionAvarageEvaluationDepartment(academicPeriodsId, departmentId);
    }

    getStatisticsQuestions(academicPeriodId: Number, departmentId: Number, activityTypeId: Number) {
        return this.statisticsManagementServicesService.getStatisticsQuestions(academicPeriodId, departmentId, activityTypeId);
    }

    getAllAcademicPeriods(page: number, size: number) {
        return this.apmAcademicPeriodManagementService.getAllAcademicPeriods(page, size);
    }
}
