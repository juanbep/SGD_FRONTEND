import { Injectable, signal, WritableSignal } from '@angular/core';
import { SmConsolidatedServicesService } from '../../../../../core/services/support-management/sm-consolidated-services.service';
import { ConsolidatedActivitiesResponse, Teacher } from '../../../../../core/models/consolidated.interface';

@Injectable({ providedIn: 'root' })
export class ConsolidatedServicesService {

    private teacherList: WritableSignal<Teacher[]> = signal([]);
    private consolidatedTeacher: WritableSignal<ConsolidatedActivitiesResponse> = signal({} as ConsolidatedActivitiesResponse);

    constructor(private service: SmConsolidatedServicesService) { }


    setDataTeachersList(newData: Teacher[]) {
        this.teacherList.update(data => data = newData);
    }


    getDataTeachersList() {
        return this.teacherList();
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
    getTeachers(page: number, totalPage: number){
        return this.service.getTeachers(page, totalPage);
    }

    /*
    * Get info teacher
    * @param {number} idEvaluated
    * @returns Observable<TeacherInformationResponse> 
    * */
    getInfoTeacher(idEvaluated: number) {
        return this.service.getInfoTeacher(idEvaluated);
    }

    /*
    * Get consolidated by teacher
    * @param {number} teacherId
    * @returns {any}
    * */
    getConsolidatedByTeacher(teacherId: number, page: number, size: number) {
        return this.service.getConsolidatedByTeacher(teacherId, page, size);
    }

    /*
    * Save consolidated
    * @param {any} consolidated
    * @returns {any}
    * */
    saveConsolidated(idEvaluated:number, idEvaluator: number, observation: string): any {
        return this.service.saveConsolidated(idEvaluated, idEvaluator, observation);
    }


    /*
    * Send email
    * @param {number} teacherId
    * @param {any} email
    * @returns {any}
    * */
    sendEmail(emails: string[], observation:string): any {
        return this.service.sendEmail(emails, observation);
    }

    
      /*
        * Method to download the source file
        * @param idSource:number
        * @returns void
        */
      downloadSourceFile(idSource: number){
        return this.service.downloadSourceFile(idSource);
      }
    
      /*
        * Method to download the report file
        * @param idSource:number
        * @param report:boolean
        * @returns void
        * */
    
      downloadReportFile(idSource: number, report:boolean ){
        return this.service.downloadReportFile(idSource, report);
    }
    

      /*
      * Method to get all the activities by user
      * @param evaluatedId: string
      * @returns observable<Actividad>
      * */
      getActivityByOidActivity(oidActivity: number){
        return this.service.getActivityByOidActivity(oidActivity);
      }
    

}



