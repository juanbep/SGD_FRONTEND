import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { SmConsolidatedServicesService } from '../../../../../core/services/support-management/sm-consolidated-services.service';
import { ConsolidatedActivitiesResponse, Teacher } from '../../../../../core/models/consolidated.interface';
import { UmUsersServicesService } from '../../../../../core/services/users-management/um-users-services.service';

@Injectable({ providedIn: 'root' })
export class ConsolidatedServicesService {

  private consolidatedTeacher: WritableSignal<ConsolidatedActivitiesResponse> = signal({} as ConsolidatedActivitiesResponse);
  private teacherList: WritableSignal<Teacher[]> = signal([]);
  private filterParams: WritableSignal<{activityType: string | null, activityName: string | null, sourceType: string | null, sourceState: string | null}> = signal({activityType: null, activityName: null, sourceType: null, sourceState: null});
  
  private smConsolidatedServicesService = inject(SmConsolidatedServicesService);
  private umUsersServicesService = inject(UmUsersServicesService);


  setDataTeachersList(newData: Teacher[]) {
    this.teacherList.update(data => data = newData);
  }


  get getDataTeachersList() {
    return this.teacherList();
  }


  setFilterParams(newData: {activityType: string | null, activityName: string | null, sourceType: string | null, sourceState: string | null}) {
    this.filterParams.update(data => data = newData);
    console.log(this.filterParams());
  }

  getFilterParams() {
    return this.filterParams();
  }

  setDataConsolidatedTeacher(newData: ConsolidatedActivitiesResponse) {
    this.consolidatedTeacher.update(data => data = newData);
  }

  getDataConsolidatedTeacher() {
    return this.consolidatedTeacher();
  }

  /*
  * Get teachers
  * @returns {any}
  * */
  getTeachers(page: number, totalPage: number) {
    return this.smConsolidatedServicesService.getTeachers(page, totalPage);
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
    return this.smConsolidatedServicesService.getConsolidatedByTeacher(teacherId, page, size);
  }

  getConsolidatedActitiesTeacherByParams(teacherId: number, page: number, size: number, activityType: string, activityName: string, sourceType:string, sourceState:string) {
    return this.smConsolidatedServicesService.getConsolidatedActitiesTeacherByParams(teacherId, page, size, activityType, activityName, sourceType, sourceState);
  }

  /*
  * Save consolidated
  * @param {any} consolidated
  * @returns {any}
  * */
  saveConsolidated(idEvaluated: number, idEvaluator: number, observation: string): any {
    return this.smConsolidatedServicesService.saveConsolidated(idEvaluated, idEvaluator, observation);
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
    return this.smConsolidatedServicesService.downloadReportFile(idSource, report);
  }


  /*
  * Method to get all the activities by user
  * @param evaluatedId: string
  * @returns observable<Actividad>
  * */
  getActivityByOidActivity(oidActivity: number) {
    return this.smConsolidatedServicesService.getActivityByOidActivity(oidActivity);
  }

  /*
  * Method to get user information
  * @param idUser: number
  * @returns observable<User>
  * */
  getUserInfo(idUser:number){
    return this.umUsersServicesService.getUserbyId(idUser);
  }


}



