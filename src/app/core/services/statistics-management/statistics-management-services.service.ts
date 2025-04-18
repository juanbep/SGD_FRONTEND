import { inject, Injectable } from '@angular/core';
import { ComparacionEvaluacionActividad } from '../../models/response/statistics/comparacion-evaluacion-actividad-response.model';
import { SimpleResponse } from '../../models/response/simple-response.model';
import { Params } from '@angular/router';
import { PromedioEvaluacionDepartamentoResponse } from '../../models/response/statistics/promedio-evaluacion-departamento-response.model';
import { EvolucionPromedioEvaluacionDepartamento } from '../../models/response/statistics/evolucion-promedio-evaluacion-departamento-response.model';
import { QuestionStatisticsResponse } from '../../models/response/statistics/questions-statistics-response';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from '../../../../environments/environments';
import { RankingDocentesResponse } from '../../models/response/statistics/ranking-docentes-response.model';

@Injectable({ providedIn: 'root' })
export class StatisticsManagementServicesService {

  private httpClient = inject(HttpClient);
  private baseUrlStatistics: string = environments.baseUrlStatistics;

  getActivityEvaluationComparison(
    idUser: number,
    academicPeriodId: number,
    activityTypeId: number | null
  ):Observable<SimpleResponse<ComparacionEvaluacionActividad>> {
    const params: Params = {
        idEvaluado: idUser,
        idPeriodo: academicPeriodId,
        idTipoActividad: activityTypeId
    };

    return this.httpClient.get<SimpleResponse<ComparacionEvaluacionActividad>>(`${this.baseUrlStatistics}/api/estadisticas/comparacion-fuente`, { params });
  }

  getAverageEvaluationDepartment(
    academicPeriodId: number
  ): Observable<SimpleResponse<PromedioEvaluacionDepartamentoResponse>> {

    const params: Params = {
      idPeriodo: academicPeriodId
    };

    return this.httpClient.get<SimpleResponse<PromedioEvaluacionDepartamentoResponse>>(`${this.baseUrlStatistics}/api/estadisticas/promedio-departamento`, { params })
  }



  getEvolutionAvarageEvaluationDepartment(academicPeriodsId:string[], departmentsId: string[] | null): Observable<SimpleResponse<EvolucionPromedioEvaluacionDepartamento[]>> {
    const params: Params = {
      periodos: academicPeriodsId.join(','),
      nombresDepartamentos: departmentsId?.length ? departmentsId.join(',') : null,
    };

    return this.httpClient.get<SimpleResponse<EvolucionPromedioEvaluacionDepartamento[]>>(`${this.baseUrlStatistics}/api/estadisticas/evolucion-promedio`, { params });
  }

  getStatisticsQuestions(academicPeriodId:String, departmentId: String, activityType: String):  Observable<SimpleResponse<QuestionStatisticsResponse[]>>{
    
    const params: Params = {
      periodos: academicPeriodId,
      departamentos: departmentId,
      tiposActividad: activityType,
    };

    return this.httpClient.get<SimpleResponse<QuestionStatisticsResponse[]>>(`${this.baseUrlStatistics}/api/estadisticas/ranking-preguntas`, { params });
  }

  rankingTeacher(period: string, department: string): Observable<SimpleResponse<RankingDocentesResponse[]>> {
    const params: Params = {
      periodos: period,
      departamentos: department,
    };
    return this.httpClient.get<SimpleResponse<RankingDocentesResponse[]>>(`${this.baseUrlStatistics}/api/estadisticas/ranking-docentes`, { params });
  }
}
