import { Injectable } from '@angular/core';
import { SmConsolidatedServicesService } from '../../../../../core/services/supportManagement/sm-consolidated-services.service';

@Injectable({ providedIn: 'root' })
export class ConsolidatedServicesService {

    constructor(private service: SmConsolidatedServicesService) { }

    /*
    * Get teachers
    * @returns {any}
    * */
    getTeachers(): any {
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
    getConsolidatedByTeacher(teacherId: number): any {
        return this.service.getConsolidatedByTeacher(teacherId);
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
    * Get consolidated by teacher
    * @param {number} teacherId
    * @returns {any}
    * */
    getConslidatedByTeacher(teacherId: number): any {
        return this.service.getConslidatedByTeacher(teacherId);
    }
}



