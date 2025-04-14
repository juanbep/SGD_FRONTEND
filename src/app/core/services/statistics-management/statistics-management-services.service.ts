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

@Injectable({ providedIn: 'root' })
export class StatisticsManagementServicesService {

  private httpClient = inject(HttpClient);
  private baseUrlStatistics: string = environments.baseUrlStatistics;

  getActivityEvaluationComparison(
    idUser: number,
    academicPeriodId: number,
    activityTypeId: number | null
  ):Observable<SimpleResponse<ComparacionEvaluacionActividad>> {
    // const comparacionEvaluacionActividad: ComparacionEvaluacionActividad = {
    //   docente: {
    //     oidUsuario: 1,
    //     usuarioDetalle: {
    //       facultad: 'FACULTAD DE INGENIERÍA ELECTRÓNICA Y TELECOMUNICACIONES',
    //       departamento: 'DEPARTAMENTO DE ELECTRONICA INSTRUMENTACION Y CONTROL',
    //       categoria: 'TITULAR',
    //       contratacion: 'PLANTA',
    //       dedicacion: 'TIEMPO COMPLETO',
    //       estudios: 'DOCTORADO',
    //     },
    //     estadoUsuario: {
    //       nombre: 'ACTIVO',
    //     },
    //     identificacion: '10548134',
    //     nombres: 'OSCAR ANDRES',
    //     apellidos: 'VIVAS ALBAN',
    //     username: 'oscar.vivas',
    //     correo: 'vsandres@unicauca.edu.co',
    //   },
    //   evaluacionesPorDepartamento: [
    //     {
    //       departamento: 'DEPARTAMENTO DE ELECTRONICA INSTRUMENTACION Y CONTROL',
    //       tiposActividad: [
    //         {
    //           tipoActividad: 'DOCENCIA',
    //           actividades: [
    //             {
    //               nombreActividad: 'Curso de Circuitos 1',
    //               fuente1: 4.5,
    //               fuente2: 4.8,
    //             },
    //             {
    //               nombreActividad: 'Electrónica Digital',
    //               fuente1: 4.3,
    //               fuente2: 4.7,
    //             },
    //           ],
    //         },
    //         {
    //           tipoActividad: 'INVESTIGACIÓN',
    //           actividades: [
    //             {
    //               nombreActividad: 'Proyecto Control Inteligente',
    //               fuente1: 4.0,
    //               fuente2: 4.5,
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       departamento: 'DEPARTAMENTO DE SISTEMAS',
    //       tiposActividad: [
    //         {
    //           tipoActividad: 'EXTENSIÓN',
    //           actividades: [
    //             {
    //               nombreActividad: 'Taller de Algoritmos en Python',
    //               fuente1: 4.7,
    //               fuente2: 4.6,
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // };
    // return comparacionEvaluacionActividad;

    const params: Params = {
        idEvaluado: idUser,
        idPeriodo: academicPeriodId,
        idTipoActividad: activityTypeId
    };

    return this.httpClient.get<SimpleResponse<ComparacionEvaluacionActividad>>(`${this.baseUrlStatistics}/api/estadisticas/comparacion-fuente`, { params });
  }

  getAverageEvaluationDepartment(
    academicPeriodId: number
  ): PromedioEvaluacionDepartamentoResponse {
    const promedioEvaluacionDepartamentoResponse: PromedioEvaluacionDepartamentoResponse =
      {
        promediosPorDepartamento: [
          {
            departamento: 'DEPARTAMENTO DE SISTEMAS Y TELEMÁTICA',
            promedioGeneral: 4.4,
          },
          {
            departamento:
              'DEPARTAMENTO DE ELECTRÓNICA, INSTRUMENTACIÓN Y CONTROL',
            promedioGeneral: 4.65,
          },
          {
            departamento: 'DEPARTAMENTO DE AUTOMÁTICA INDUSTRIAL',
            promedioGeneral: 4.15,
          },
        ],
      };
    return promedioEvaluacionDepartamentoResponse;

    // const params: Params = {
    //   academicPeriodId: academicPeriodId
    // };

    // return this.http.get<SimpleResponse<PromedioEvaluacionDepartamentoResponse>>(`/api/statistics-management/average-evaluation-department`, { params })
  }

  getEvolutionAvarageEvaluationDepartment(academicPeriodsId:string[], departmentId: string): EvolucionPromedioEvaluacionDepartamento[] {
    const evolucionPromedioEvaluacionDepartamento: EvolucionPromedioEvaluacionDepartamento[] =
      [
        {
          departamento: 'DEPARTAMENTO DE SISTEMAS',
          evolucion: [  
            {
              periodo: '2023-1',
              promedioConsolidado: 50,
            },
            {
              periodo: '2023-2',
              promedioConsolidado: 55,
            },
            {
              periodo: '2024-1',
              promedioConsolidado: 88,
            },
            {
              periodo: '2024-2',
              promedioConsolidado: 100,
            }
          ],
        },
        {
          departamento:
            'DEPARTAMENTO DE ELECTRÓNICA, INSTRUMENTACIÓN Y CONTROL',
          evolucion: [
            {
              periodo: '2023-1',
              promedioConsolidado: 95,
            },
            {
              periodo: '2023-2',
              promedioConsolidado: 60,
            },
              
              {
                periodo: '2024-1',
                promedioConsolidado: 73,
              },
              {
                periodo: '2024-2',
                promedioConsolidado: 55,
              },
          ],
        },
      ];
    return evolucionPromedioEvaluacionDepartamento;

    // return this.http.get<SimpleResponse<EvolucionPromedioEvaluacionDepartamento>>(`/api/statistics-management/evolution-average-evaluation-department`)
  }

  getStatisticsQuestions(academicPeriodId:Number, departmentId: Number, activityType: Number): QuestionStatisticsResponse{
    const questionStatisticsResponse: QuestionStatisticsResponse = {
      periodo: {
        oidPeriodo: 1,
        nombre: '2023-1',
      },
      tipoActividad: {
        oidTipoActividad: 1,
        nombre: 'DOCENCIA',
      },
      evaluacionPorPregunta: [
        {
          pregunta: '1',
          promedioCalificacion: 4.5,
        },
        {
          pregunta: '2',
          promedioCalificacion: 4.8,
        },
        {
          pregunta:
            '3',
          promedioCalificacion: 4.3,
        },
        {
          pregunta: '4',
          promedioCalificacion: 4.7,
        },
        {
          pregunta: '5',
          promedioCalificacion: 4.6,
        },
        {
          pregunta: '6',
          promedioCalificacion: 4.4,
        },
      ],
    };
    return questionStatisticsResponse;
  }
}
