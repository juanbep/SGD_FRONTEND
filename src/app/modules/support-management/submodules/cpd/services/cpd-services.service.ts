import { inject, Injectable } from '@angular/core';
import { SmCpdServicesService } from '../../../../../core/services/support-management/sm-cpd-services.service';
import { SmActivitiesServicesService } from '../../../../../core/services/support-management/sm-activities-services.service';
import { UmUsersServicesService } from '../../../../../core/services/users-management/um-users-services.service';
import { SmConsolidatedServicesService } from '../../../../../core/services/support-management/sm-consolidated-services.service';

@Injectable({ providedIn: 'root' })
export class CpdServicesService {
  smCpdServicesService = inject(SmCpdServicesService);
  smActivitiesServicesService = inject(SmActivitiesServicesService);
  smConsolidatedServicesService = inject(SmConsolidatedServicesService);
  umUsersServicesService = inject(UmUsersServicesService);

  /*
   * Get users with consolidated created
   * @param {number}
   * @param {number}
   * @param {string}
   * @returns {Observable<SimpleResponse<PagedResponse<UsuarioConsolidadoCreadoResponse>>}
   * */
  getUsersWithConsolidatedCreated(
    page: number,
    totalPage: number,
    department: string | null,
    userId: string | null,
    userName: string | null,
    category: string | null,
    rol: string | null
  ) {
    return this.smConsolidatedServicesService.getUsersWithConsolidatedCreated(
      page,
      totalPage,
      department,
      userId,
      userName,
      category,
      rol
    );
  }

  getTeachersByDepartment(
    page: number,
    totalPage: number,
    department: string,
    userId: string | null,
    userName: string | null,
    category: string | null,
    rol: string | null
  ) {
    return this.umUsersServicesService.getAllUsersByParams(
      page,
      totalPage,
      userId,
      userName,
      null,
      department,
      category,
      null,
      null,
      null,
      rol,
      null
    );
  }

  getActivities(
    page: number,
    totalPage: number,
    idUser: number,
    activityName: string | null,
    activityType: string | null
  ) {
    return this.smActivitiesServicesService.getActivities(
      idUser,
      activityName,
      activityType,
      null,
      null,
      page,
      totalPage
    );
  }

  getTeacherInfo(idUser: number) {
    return this.umUsersServicesService.getUserbyId(idUser);
  }

  downloadFiles(
    period: string,
    department: string,
    contractType: string | null,
    idUser: number | null,
    esConsolidado: boolean | null
  ) {
    return this.smConsolidatedServicesService.downloadAllSupportFiles(
      period,
      department,
      contractType,
      idUser,
      esConsolidado
    );
  }

  getInformationTeacherConsolidatedResponse(idUser: number) {
    return this.smConsolidatedServicesService.getInfoTeacher(idUser);
  }
}
