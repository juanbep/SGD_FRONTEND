import { Injectable, signal, WritableSignal } from '@angular/core';
import { SmConsolidatedServicesService } from '../../../../../core/services/supportManagement/sm-consolidated-services.service';
import { Consolidated, Teacher } from '../../../../../core/models/consolidated.interface';

@Injectable({ providedIn: 'root' })
export class ConsolidatedServicesService {

    private teacherList: WritableSignal<Teacher[]> = signal([]);
    private consolidatedTeacher: WritableSignal<any> = signal({});

    constructor(private service: SmConsolidatedServicesService) { }


    setDataTeachersList(newData: Teacher[]) {
        this.teacherList.update(data => data = newData);
    }


    getDataTeachersList() {
        return this.teacherList();
    }

    setDataConsolidatedTeacher(newData: Consolidated) {
        this.consolidatedTeacher.update(data => data = newData);
    }
    
    getDataConsolidatedTeacher() {
        return this.consolidatedTeacher();
    }

    /*
    * Get teachers
    * @returns {any}
    * */
    getTeachers() {
        return this.service.getTeachers();
    }

    /*
    * Get info teacher
    * @param {number} teacherId
    * @returns {any}
    * */
    getInfoTeacher(teacherId: number): any {
        return this.service.getInfoTeacher(teacherId);
    }

    /*
    * Get consolidated by teacher
    * @param {number} teacherId
    * @returns {any}
    * */
    getConsolidatedByTeacher(teacherId: number, department: string){
        return this.service.getConsolidatedByTeacher(teacherId, department);
    }

    /*
    * Save consolidated
    * @param {any} consolidated
    * @returns {any}
    * */
    saveConsolidated(consolidated: any): any {
        return this.service.saveConsolidated(consolidated);
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
}



