import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ApmAcademicPeriodManagementService } from '../../../core/services/academic-period-management/apm-academic-period-management-service.service';
import { catchError, of, tap } from 'rxjs';
import { PeriodoAcademicoResponse } from '../../../core/models/response/periodo-academico-response.model';
import { PeriodoAcademicoCreate } from '../../../core/models/modified/periodo-academico-create.model';
import { PagedResponse } from '../../../core/models/response/paged-response.model';
import { UmUsersServicesService } from '../../../core/services/users-management/um-users-services.service';

@Injectable({providedIn: 'root'})
export class AcademicPeriodManagementService {

    private academicPeriods: WritableSignal<PagedResponse<PeriodoAcademicoResponse> | null> = signal(null);


    private apmAcademicPeriodManagementService = inject(ApmAcademicPeriodManagementService);

    private umUsersServicesService = inject(UmUsersServicesService);

    private _currentAcademicPeriod = signal<PeriodoAcademicoResponse | null>(null);

    get currentAcademicPeriodValue(): PeriodoAcademicoResponse | null {
        return this._currentAcademicPeriod();
    }

    setAcademicPeriods(newData: PagedResponse<PeriodoAcademicoResponse> ){
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
    saveNewAcademicPeriod(newAcademicPeriod: PeriodoAcademicoCreate){
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

    editAcademicPeriod(oidAcademicPeriod:number ,academicPeriod: PeriodoAcademicoCreate){
        return this.apmAcademicPeriodManagementService.editAcademicPeriod(oidAcademicPeriod,academicPeriod);
    }

    /*
    * Method to get academic period active
    * @returns Observable<AcademicPeriodResponse>
    * */

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
                this._currentAcademicPeriod.set(academicPeriod.data);
            }),
            catchError(error => {
                return of(error.error.mensaje)
            }


        )
    )}

    /*
    * Method to get information of teachers and activities from KIRA
    * @param idPeriodo: string
    * */

    loadInfoTechersAndActivities(idPeriodo: string){
        return this.apmAcademicPeriodManagementService.loadInfoTechersAndActivities(idPeriodo);
    }

    /*
    * Method to get the academic periods from KIRA
    * @returns Observable<AcademicPeriodResponse>
    * */
    getAcademicPeriodsByKira(){
        return this.apmAcademicPeriodManagementService.getAcademicPeriodsByKira();
    }

    /*
    * Method to get users by params
    * @param page: number
    * @param size: number
    * @param userId: string | null
    * @param userName: string | null
    *  @param faculty: string | null
    * @param department: string | null
    * @param category: string | null
    * @param hiring: string | null
    * @param dedication: string | null
    * @param studies: string | null
    * @param rol: string | null
    * @param state: string | null
    * @returns Observable<UsersResponse>
    * */
    getUsersByParams(page: number, size: number, userId: string | null, userName:string | null, faculty: string | null, department: string | null, category: string | null, hiring: string | null, dedication: string | null, studies: string | null, rol: string | null, state: string | null){
        return this.umUsersServicesService.getAllUsersByParams(page,size,userId,userName,faculty,department,category,hiring,dedication,studies,rol,state);
    }

}