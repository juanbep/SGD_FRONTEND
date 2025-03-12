import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { SmConsolidatedServicesService } from '../../../../../core/services/support-management/sm-consolidated-services.service';
import { UmUsersServicesService } from '../../../../../core/services/users-management/um-users-services.service';
import { SmActivitiesServicesService } from '../../../../../core/services/support-management/sm-activities-services.service';
import { PagedResponse } from '../../../../../core/models/response/paged-response.model';
import { ActividadConsolidadoResponse } from '../../../../../core/models/response/actividad-consolidado-response.model';
import { UsuarioConsolidadoResponse } from '../../../../../core/models/response/usuario-consolidado-response.model';

@Injectable({ providedIn: 'root' })
export class ConsolidatedServicesService {
  private consolidatedTeacher: WritableSignal<ActividadConsolidadoResponse> =
    signal({} as ActividadConsolidadoResponse);
  private teacherList: WritableSignal<UsuarioConsolidadoResponse[]> = signal(
    []
  );
  private filterActivitiesParams: WritableSignal<{
    activityType: string | null;
    activityName: string | null;
    sourceType: string | null;
    sourceState: string | null;
  }> = signal({
    activityType: null,
    activityName: null,
    sourceType: null,
    sourceState: null,
  });
  private filterTeacherParams: WritableSignal<{
    teacherType: string | null;
    contractType: string | null;
  }> = signal({ teacherType: null, contractType: null });

  private smConsolidatedServicesService = inject(SmConsolidatedServicesService);
  private smActivitiesServicesService = inject(SmActivitiesServicesService);
  private umUsersServicesService = inject(UmUsersServicesService);

  setDataTeachersList(newData: UsuarioConsolidadoResponse[]) {
    this.teacherList.update((data) => (data = newData));
  }

  get getDataTeachersList() {
    return this.teacherList();
  }

  setFilterTeacherParams(newData: {
    teacherType: string | null;
    contractType: string | null;
  }) {
    this.filterTeacherParams.update((data) => (data = newData));
  }

  getFilterTeacherParams() {
    return this.filterTeacherParams();
  }

  setFilterActivitiesParams(newData: {
    activityType: string | null;
    activityName: string | null;
    sourceType: string | null;
    sourceState: string | null;
  }) {
    this.filterActivitiesParams.update((data) => (data = newData));
  }

  getFilterActivitiesParams() {
    return this.filterActivitiesParams();
  }

  setDataConsolidatedTeacher(newData: ActividadConsolidadoResponse) {
    this.consolidatedTeacher.update((data) => (data = newData));
  }

  getDataConsolidatedTeacher() {
    return this.consolidatedTeacher();
  }



  /*
   * Get teachers
   * @returns {any}
   * */
  getTeachers(page: number, totalPage: number, department: string) {
    return this.smConsolidatedServicesService.getTeachers(
      page,
      totalPage,
      department
    );
  }

  /*
   * Get info teacher
   * @param {number} idEvaluated
   * @returns Observable<TeacherInformationResponse>
   * */
  getInfoTeacher(idEvaluated: number) {
    return this.smConsolidatedServicesService.getInfoTeacher(idEvaluated);
  }

  /*
   * Get consolidated by teacher
   * @param {number} teacherId
   * @returns {any}
   * */
  getConsolidatedByTeacher(teacherId: number, page: number, size: number) {
    return this.smConsolidatedServicesService.getConsolidatedByTeacher(
      teacherId,
      page,
      size
    );
  }

  getConsolidatedActitiesTeacherByParams(
    teacherId: number,
    page: number,
    size: number,
    activityType: string,
    activityName: string,
    sourceType: string,
    sourceState: string
  ) {
    return this.smConsolidatedServicesService.getConsolidatedActitiesTeacherByParams(
      teacherId,
      page,
      size,
      activityType,
      activityName,
      sourceType,
      sourceState
    );
  }

  /*
   * Save consolidated
   * @param {any} consolidated
   * @returns {any}
   * */
  saveConsolidated(
    idEvaluated: number,
    idEvaluator: number,
    observation: string
  ) {
    return this.smConsolidatedServicesService.saveConsolidated(
      idEvaluated,
      idEvaluator,
      observation
    );
  }

  /*
   * Send email
   * @param {number} teacherId
   * @param {any} email
   * @returns {any}
   * */
  sendEmail(emails: string[], observation: string): any {
    return this.smConsolidatedServicesService.sendEmail(emails, observation);
  }

  /*
   * Method to download the source file
   * @param idSource:number
   * @returns void
   */
  downloadSourceFile(idSource: number) {
    return this.smConsolidatedServicesService.downloadSourceFile(idSource);
  }

  /*
   * Method to download the report file
   * @param idSource:number
   * @param report:boolean
   * @returns void
   * */

  downloadReportFile(idSource: number, report: boolean) {
    return this.smConsolidatedServicesService.downloadReportFile(
      idSource,
      report
    );
  }

  /*
   * Method to get all the activities by user
   * @param evaluatedId: string
   * @returns observable<Actividad>
   * */
  getActivityByOidActivity(oidActivity: number) {
    return this.smActivitiesServicesService.getActivityById(oidActivity);
  }

  /*
   * Method to get user information
   * @param idUser: number
   * @returns observable<User>
   * */
  getUserInfo(idUser: number) {
    return this.umUsersServicesService.getUserbyId(idUser);
  }

  /*
   * Method to download all support files
   * @param period:string
   * @param department:string
   * @param contractType:string
   * @param idUser:number
   * @returns blob
   * */
  downloadAllSupportFiles(
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

  /*
   * Method to download the consolidated file
   * @param idConsolidado:number
   * @returns blob
   * */
  downloadConsolidatedFile(idConsolidado: number) {
    return this.smConsolidatedServicesService.downloadConsolidatedFile(
      idConsolidado
    );
  }

  /*
   * Method to get information teacher consolidated response
   * @param idUser:number
   * @returns observable<SimpleResponse<DetalleUsuarioConsolidadoResponse>>
   * */

  getConsolidatedInfoTeacher(idUser: number) {
    return this.smConsolidatedServicesService.getInfoTeacher(idUser);
  }
}
