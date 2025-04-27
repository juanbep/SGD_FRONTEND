import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChartComponent } from '../../components/chart/chart.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { debounceTime, max } from 'rxjs';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';
import { StatisticsService } from '../../services/statistics-service.service';
import { ComparacionEvaluacionActividad } from '../../../../../../core/models/response/statistics/comparacion-evaluacion-actividad-response.model';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { SimpleResponse } from '../../../../../../core/models/response/simple-response.model';
import { PeriodoAcademicoResponse } from '../../../../../../core/models/response/periodo-academico-response.model';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    NgMultiSelectDropDownModule,
    ChartComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    LineChartComponent,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private statisticsService: StatisticsService = inject(StatisticsService);
  private catalogDataService: CatalogDataService = inject(CatalogDataService);
  private messageInfoService: MessagesInfoService = inject(MessagesInfoService);

  public userResponseSearch: PagedResponse<UsuarioResponse> | null = null;
  public showUserNameDropdown: boolean = false;
  public academicPeriodResponse: PeriodoAcademicoResponse[] = [];

  public dropdownAcademicPeriodsList: { item_id: number; item_text: string }[] =
    [];
  public dropdownDepartmentList: { item_id: string; item_text: string }[] = [];

  public dropdownActivityTypeList: { item_id: string; item_text: string }[] =
    [];

  public dropdownSettings = {};

  public catalogData: CatalogDataResponse | null = null;

  public labels: string[] = [];
  public dataSets: {
    label: string;
    data: Number[];
    borderWidth: number;
  }[] = [];

  public formStatistics: FormGroup = this.formBuilder.group({
    statisticsType: [''],
    teacher: [''],
    academicPeriod: [''],
    activityType: [''],
    department: [''],
  });

  ngOnInit() {
    this.litenerStatisticsTypeAndAddValidators();
    this.listenerTeacherName();
    this.recoverAcademicPeriods();
    this.catalogData = this.catalogDataService.catalogDataSignal;
    this.dropdownSettings = {
      singleSelection: false,
      maxHeight: 197,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar',
    };
  }

  clearFormLabels() {
    this.formStatistics.get('academicPeriod')?.setValue('');
    this.formStatistics.get('department')?.setValue('');
    this.formStatistics.get('teacher')?.setValue('');
    this.formStatistics.get('activityType')?.setValue('');
    this.formStatistics.get('teacher')?.clearValidators();
    this.formStatistics.get('academicPeriod')?.clearValidators();
    this.formStatistics.get('department')?.clearValidators();
    this.formStatistics.get('activityType')?.clearValidators();
    this.formStatistics.get('teacher')?.updateValueAndValidity();
    this.formStatistics.get('academicPeriod')?.updateValueAndValidity();
    this.formStatistics.get('department')?.updateValueAndValidity();
    this.formStatistics.get('activityType')?.updateValueAndValidity();

    this.dataSets = [];
    this.labels = [];
  }

  litenerStatisticsTypeAndAddValidators() {
    this.formStatistics
      .get('statisticsType')
      ?.valueChanges.subscribe((value) => {
        this.clearFormLabels();
        this.dropdownAcademicPeriodsList = [];
        this.dropdownDepartmentList = [];
        this.dropdownActivityTypeList = [];
        switch (value) {
          case '1':
            this.formStatistics
              .get('teacher')
              ?.setValidators([Validators.required]);
            break;
          case '4':
            this.formStatistics
              .get('academicPeriod')
              ?.setValidators([Validators.required]);
            this.academicPeriodResponse.map((academicPeriod) => {
              this.dropdownAcademicPeriodsList.push({
                item_id: academicPeriod.oidPeriodoAcademico,
                item_text: academicPeriod.idPeriodo,
              });
            });
            this.catalogData?.departamentos.map((department) => {
              this.dropdownDepartmentList.push({
                item_id: department.codigo,
                item_text: department.nombre,
              });
            });
            break;
          case '5':
            this.formStatistics
              .get('academicPeriod')
              ?.setValidators([Validators.required]);
            this.formStatistics
              .get('department')
              ?.setValidators([Validators.required]);
            break;
        }
      });
  }

  isInvaldField(field: string) {
    const control = this.formStatistics.get(field);
    return (
      control &&
      control.errors &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  getFieldError(field: string): string | null {
    if (!this.formStatistics.controls[field]) return null;
    const control = this.formStatistics.controls[field];
    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        default:
          return null;
      }
    }
    return null;
  }

  chartDestroyed() {
    this.dataSets = [];
    this.labels = [];
  }

  generateChart(activityType: string) {
    if (this.formStatistics.invalid) {
      this.formStatistics.markAllAsTouched();
      return;
    }
    this.dataSets = [];
    this.labels = [];
    switch (activityType) {
      case '1':
        this.formStatistics
          .get('teacher')
          ?.setValidators([Validators.required]);
        this.formStatistics.get('teacher')?.updateValueAndValidity();
        this.recoverActivityEvaluationComparison();
        break;
      
      case '2':
        this.recoverAverageEvaluationByDepartment();
        break;
      case '3':
        this.recoverRakingTeacher();
        break;
      case '4':
        this.recoverEvolutionAverageEvaluationDepartment();
        break;
      case '5':
        this.recoverStatisticsQuestions();
        break;
      default:
        break;
    }
  }

  recoverAcademicPeriods() {
    this.statisticsService.getAllAcademicPeriods(0, 100).subscribe({
      next: (response) => {
        response.data.content.map((academicPeriod) => {
          this.academicPeriodResponse.push(academicPeriod);
        });
      },
    });
  }

  public recoverActivityEvaluationComparison() {
    const idUser = this.formStatistics.get('teacher')?.value.oidUsuario;
    const academicPeriodId = this.formStatistics.get('academicPeriod')?.value;
    const activityTypeId = this.formStatistics.get('activityType')?.value;
    this.statisticsService
      .getActivityEvaluationComparison(idUser, academicPeriodId, activityTypeId)
      .subscribe({
        next: (
          comparacionEvaluacionActividad: SimpleResponse<ComparacionEvaluacionActividad>
        ) => {
          if (
            comparacionEvaluacionActividad.data.evaluacionesPorDepartamento
              .length === 0
          ) {
            this.messageInfoService.showErrorMessage(
              'No hay datos para mostrar',
              'Error'
            );
            return;
          }
          let fuente1: Number[] = [];
          let fuente2: Number[] = [];
          let actividades: string[] = [];
          comparacionEvaluacionActividad.data.evaluacionesPorDepartamento.forEach(
            (evaluacion) => {
              evaluacion.tiposActividad.forEach((tipoActividad) => {
                tipoActividad.actividades.forEach((actividad) => {
                  fuente1.push(actividad.fuente1);
                  fuente2.push(actividad.fuente2);
                  actividades.push(actividad.nombreActividad);
                });
              });
            }
          );
          this.labels = actividades;
          this.dataSets = [
            {
              label: 'Fuente 1 (Autoevaluación)',
              data: fuente1,
              borderWidth: 1,
            },
            {
              label: 'Fuente 2',
              data: fuente2,
              borderWidth: 1,
            },
          ];
        },
        error: (error) => {
          this.messageInfoService.showErrorMessage(
            error.error.mensaje,
            'Error'
          );
        },
      });
  }

  recoverAverageEvaluationByDepartment() {
    const academicPeriodId = this.formStatistics.get('academicPeriod')?.value;
    this.statisticsService
      .getAverageEvaluationByDepartment(academicPeriodId)
      .subscribe({
        next: (response) => {
          if (response.data.promediosPorDepartamento.length === 0) {
            this.messageInfoService.showErrorMessage(
              'No hay datos para mostrar',
              'Error'
            );
            return;
          }
          let promedios: number[] = [];
          let departamentos: string[] = [];
          response.data.promediosPorDepartamento.forEach((promedio) => {
            promedios.push(promedio.promedioGeneral);
            departamentos.push(promedio.departamento);
          });
          this.labels = departamentos;
          this.dataSets = [
            {
              label: 'Promedio General',
              data: promedios,
              borderWidth: 1,
            },
          ];
        },
        error: (error) => {
          this.messageInfoService.showErrorMessage(
            error.error.mensaje,
            'Error'
          );
        },
      });
  }

  recoverEvolutionAverageEvaluationDepartment() {
    let academicPeriodsId: string[] = [];
    let departementsId: string[] = [];

    this.formStatistics.get('academicPeriod')?.value.forEach((period: any) => {
      academicPeriodsId.push(period.item_id);
    });

    if (this.formStatistics.get('department')?.value.length != 0) {
      this.formStatistics
        .get('department')
        ?.value.forEach((department: any) => {
          departementsId.push(department.item_id);
        });
    }
    this.statisticsService
      .getEvolutionAverageEvaluationDepartment(
        academicPeriodsId,
        departementsId
      )
      .subscribe({
        next: (response) => {
          if (response.data.length === 0) {
            this.messageInfoService.showErrorMessage(
              'No hay datos para mostrar',
              'Error'
            );
            return;
          }

          // Reunir todos los periodos
          let allPeriods: string[] = [];
          response.data.forEach((department) => {
            department.evolucion.forEach((evolucion) => {
              if (!allPeriods.includes(evolucion.periodo)) {
                allPeriods.push(evolucion.periodo);
              }
            });
          });

          // Ordenar por año-semestre
          allPeriods.sort((a, b) => {
            const [yearA, semA] = a.split('-').map(Number);
            const [yearB, semB] = b.split('-').map(Number);
            return yearA === yearB ? semA - semB : yearA - yearB;
          });

          // Construir dataSets en orden
          let dataSetsAux: any[] = [];
          response.data.forEach((department) => {
            let mapPromedios: Record<string, number> = {};
            department.evolucion.forEach((evol) => {
              mapPromedios[evol.periodo] = evol.promedioConsolidado;
            });

            let sortedPromedios = allPeriods.map(
              (period) => mapPromedios[period]
            );
            dataSetsAux.push({
              label: department.departamento,
              data: sortedPromedios,
              borderWidth: 1,
            });
          });

          this.labels = allPeriods;
          this.dataSets = dataSetsAux;
        },
      });
  }

  recoverStatisticsQuestions() {
    let academicPeriod : string;
    let departementId: string;
    let activityTypeId: string;

    academicPeriod = this.formStatistics.get('academicPeriod')?.value;
    departementId = this.formStatistics.get('department')?.value;
    activityTypeId = this.formStatistics.get('activityType')?.value;
    
    this.statisticsService
      .getStatisticsQuestions(academicPeriod, departementId, activityTypeId)
      .subscribe({
        next: (response) => {
          if (response.data.length === 0) {
            this.messageInfoService.showErrorMessage(
              'No hay datos para mostrar',
              'Error'
            );
            return;
          }
          let preguntas: string[] = [];
          let promedios: number[] = [];
          response.data.forEach((periodo) => {
            periodo.departamentos.forEach((departamento) => {
              departamento.tiposActividad.forEach((tipoActividad) => {
                tipoActividad.preguntas.forEach((pregunta) => {
                  preguntas.push(pregunta.oidPregunta.toString());
                  promedios.push(pregunta.promedio);
                });
              });
            });
          });
          //ordenar promedios y preguntas por preguntas
          let sortedData = preguntas.map((_, index) => {
            return {
              pregunta: preguntas[index],
              promedio: promedios[index],
            };
          });
          sortedData.sort((a, b) => {
            return Number(a.pregunta) - Number(b.pregunta);
          });
          this.labels = sortedData.map((item) => item.pregunta);
          this.dataSets = [
            {
              label: 'Promedio',
              data: sortedData.map((item) => item.promedio),
              borderWidth: 1,
            },
          ];  
        },
        error: (error) => {
          this.messageInfoService.showErrorMessage(
            error.error.mensaje,
            'Error'
          );
        },
      });
  }

  recoverRakingTeacher() {
    const academicPeriodId = this.formStatistics.get('academicPeriod')?.value;
    const departmentId = this.formStatistics.get('department')?.value;
    this.statisticsService.getRankingTeacher(academicPeriodId, departmentId).subscribe({
      next: (response) => {
        if (response.data.length === 0) {
          this.messageInfoService.showErrorMessage(
            'No hay datos para mostrar',
            'Error'
          );
          return;
        }
        let promedios: number[] = [];
        let docentes: string[] = [];
        response.data.forEach((ranking) => {
          ranking.departamentos.forEach((departamento) => {
            departamento.docentes.forEach((docente) => {
              promedios.push(docente.calificacion);
              docentes.push(docente.nombre);
            });
          });
        });
        this.labels = docentes;
        this.dataSets = [
          {
            label: 'Ranking Docentes',
            data: promedios,
            borderWidth: 1,
          },
        ];
      },
      error: (error) => {
        this.messageInfoService.showErrorMessage(
          error.error.mensaje,
          'Error'
        );
      },
    });
  }

  validateUserExist(
    idUser: string | null,
    userName: string,
    rol: number | null,
    department: string | null,
    faculty: string | null
  ): void {
    if (!this.showUserNameDropdown) {
      return;
    }
    this.statisticsService

      .getUserByParams(0, 3, '', userName, '', '', '', '', '', '', '', '1')
      .subscribe({
        next: (response) => {
          this.userResponseSearch = response.data;
        },
        error: (error) => {
          this.userResponseSearch = null;
        },
      });
  }

  showDropdownUserNameList(): void {
    this.showUserNameDropdown = true;
  }

  hideDropdownUserNameList(): void {
    setTimeout(() => {
      this.showUserNameDropdown = false;
    }, 100);
  }

  selectUser(user: UsuarioResponse) {
    this.formStatistics.get('teacher')?.setValue(user);
    this.userResponseSearch = null;
    this.showUserNameDropdown = false;
  }

  listenerTeacherName() {
    this.formStatistics
      .get('teacher')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        if (value) {
          this.validateUserExist(null, String(value).trim(), null, null, null);
        } else {
          this.userResponseSearch = null;
        }
      });
  }
}
