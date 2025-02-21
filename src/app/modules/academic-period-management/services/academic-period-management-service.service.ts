import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ApmAcademicPeriodManagementService } from '../../../core/services/academic-period-management/apm-academic-period-management-service.service';
import { AcademicPeriod, AcademicPeriodResponse, NewAcademicPeriod } from '../../../core/models/academicPeriods';
import { tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AcademicPeriodManagementService {

    private academicPeriods: WritableSignal<AcademicPeriodResponse | null> = signal(null);


    private apmAcademicPeriodManagementService = inject(ApmAcademicPeriodManagementService);


    private _currentAcademicPeriod = signal<AcademicPeriod | null>(null);

    get currentAcademicPeriodValue(): AcademicPeriod | null {
        return this._currentAcademicPeriod();
    }

    setAcademicPeriods(newData: AcademicPeriodResponse){
        console.log(newData);
        this.academicPeriods.update(data => data = newData);
    }

    getDatAcademicPeriods(){
        return this.academicPeriods();
    }

    /*
    * Method to save a new academic period
    * @param newAcademicPeriod: NewAcademicPeriod
    * @returns Observable<AcademicPeriod>
    * */
    saveNewAcademicPeriod(newAcademicPeriod: NewAcademicPeriod){
        return this.apmAcademicPeriodManagementService.saveNewAcademicPeriod(newAcademicPeriod);
    }


    /*
    * Method to get all the academic periods
    * @returns Observable<AcademicPeriodResponse>
    * */
    getAllAcademicPeriods(page: number, size: number){
        return this.apmAcademicPeriodManagementService.getAllAcademicPeriods(page, size);
    }

    /*
    * Method to edit an academic period
    * @param academicPeriod: AcademicPeriod
    * @returns Observable<AcademicPeriod>
    * */

    editAcademicPeriod(oidAcademicPeriod:number ,academicPeriod: NewAcademicPeriod){
        return this.apmAcademicPeriodManagementService.editAcademicPeriod(oidAcademicPeriod,academicPeriod);
    }

    activeAcademicPeriod(){
        return this.apmAcademicPeriodManagementService.getAllAcademicPeriods(null,null);
    }

    /*
    * Method to get the active academic period
    * @returns Observable<AcademicPeriod>
    * */
    getActiveAcademicPeriod(){
        return this.apmAcademicPeriodManagementService.activeAcademicPeriod().pipe(
            tap(academicPeriod => {
                this._currentAcademicPeriod.set(academicPeriod);
            })
        )
    }

}