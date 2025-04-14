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
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { debounceTime, max } from 'rxjs';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';
import { on } from 'events';
import { StatisticsService } from '../../services/statistics-service.service';
import { ComparacionEvaluacionActividad } from '../../../../../../core/models/response/statistics/comparacion-evaluacion-actividad-response.model';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { PromedioEvaluacionDepartamentoResponse } from '../../../../../../core/models/response/statistics/promedio-evaluacion-departamento-response.model';
import { QuestionStatisticsResponse } from '../../../../../../core/models/response/statistics/questions-statistics-response';
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
export class StatisticsComponent implements OnInit, OnDestroy {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private statisticsService: StatisticsService = inject(StatisticsService);
  private catalogDataService: CatalogDataService = inject(CatalogDataService);
  private messageInfoService: MessagesInfoService = inject(MessagesInfoService);

  public userResponseSearch: PagedResponse<UsuarioResponse> | null = null;
  public showUserNameDropdown: boolean = false;
  public academicPeriodResponse: PeriodoAcademicoResponse[] = [];


  dropdownList: { item_id: number; item_text: string }[] = [];
  dropdownDepartmentList: { item_id: number; item_text: string }[] = [];
  selectedItems: {} = [];
  selectDepartmentItems: {} = [];
  dropdownSettings = {};
  public settings = {};
  public chart: any;

  public catalogData: CatalogDataResponse | null = null;

  labels: string[] = [];
  dataSets: {
    label: string;
    data: Number[];
    borderWidth: number;
  }[] = [];

  formStatistics: FormGroup = this.formBuilder.group({
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
    this.dropdownList = [
      { item_id: 1, item_text: '2024-2' },
      { item_id: 2, item_text: '2024-1' },
      { item_id: 3, item_text: '2023-2' },
      { item_id: 4, item_text: '2023-1' },
      { item_id: 5, item_text: '2022-2' },
      { item_id: 6, item_text: '2022-1' },
      { item_id: 7, item_text: '2021-2' },
      { item_id: 8, item_text: '2021-1' },
      { item_id: 9, item_text: '2020-2' },
      { item_id: 10, item_text: '2020-1' },
    ];

    this.dropdownDepartmentList = [
      { item_id: 1, item_text: 'Departamento de sistemas' },
      { item_id: 2, item_text: 'Departamento de electrónica, intrumentación y control' },
      { item_id: 3, item_text: 'Ingeniería Industrial' },
      { item_id: 4, item_text: 'Ingeniería Ambiental' },
      { item_id: 5, item_text: 'Ingeniería Civil' },
      { item_id: 6, item_text: 'Ingeniería de Alimentos' },
      { item_id: 7, item_text: 'Ingeniería de Petróleos' },
    ];

    this.dropdownSettings = {
      singleSelection: false,
      maxHeight:197,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      searchPlaceholderText: 'Buscar',

    };
  }

  litenerStatisticsTypeAndAddValidators() {
    this.formStatistics.get('statisticsType')?.valueChanges.subscribe((value) => {
      if(value === '1') {

        this.formStatistics.get('teacher')?.setValidators([Validators.required]);
      }
    });
  }

  isInvaldField(field: string) {
    const control = this.formStatistics.get(field);
    return control && control.errors && control.invalid && (control.dirty || control.touched);
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


  generateChart(activityType: string) {
    if(this.formStatistics.invalid) {
      this.formStatistics.markAllAsTouched();
      return;
    }
    this.dataSets = [];
    this.labels = [];
    switch (activityType) {
      case'1':
        this.formStatistics.get('teacher')?.setValidators([Validators.required]);
        this.formStatistics.get('teacher')?.updateValueAndValidity();
        this.recoverActivityEvaluationComparison();
        break;
      case '2':
        this.recoverAverageEvaluationByDepartment();
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
      }
    });
  }

  public recoverActivityEvaluationComparison() {
    const idUser = this.formStatistics.get('teacher')?.value.oidUsuario;
    const academicPeriodId = this.formStatistics.get('academicPeriod')?.value;
    const activityTypeId = this.formStatistics.get('activityType')?.value;
    this.statisticsService.getActivityEvaluationComparison(idUser, academicPeriodId, activityTypeId).subscribe({
      next: (comparacionEvaluacionActividad: SimpleResponse<ComparacionEvaluacionActividad>) => {
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
        this.messageInfoService.showErrorMessage(error.error.mensaje, 'Error')
      },
    });
  }



  recoverAverageEvaluationByDepartment() {
    const promedioEvaluacionDepartamentoResponse: PromedioEvaluacionDepartamentoResponse =
      this.statisticsService.getAverageEvaluationByDepartment(1);
    let promedios: number[] = [];
    let departamentos: string[] = [];
    promedioEvaluacionDepartamentoResponse.promediosPorDepartamento.forEach(
      (promedio) => {
        promedios.push(promedio.promedioGeneral);
        departamentos.push(promedio.departamento);
      }
    );
    this.labels = departamentos;
    this.dataSets = [
      {
        label: 'Promedio General',
        data: promedios,
        borderWidth: 1,
      },
    ];
  }

  recoverEvolutionAverageEvaluationDepartment() {
    const academicPeriodsId = this.formStatistics.get('academicPeriod')?.value;
    const departmentId = this.formStatistics.get('department')?.value;
    const evolucionPromedioEvaluacionDepartamentoResponse =
      this.statisticsService.getEvolutionAverageEvaluationDepartment(
        academicPeriodsId,
        departmentId
      );
    let promedios: number[] = [];
    let periodos: string[] = [];
    evolucionPromedioEvaluacionDepartamentoResponse.forEach((department) => {
      let promedio: number[] = [];
      department.evolucion.forEach((evolucion) => {
        if(periodos.indexOf(evolucion.periodo) === -1) {
        periodos.push(evolucion.periodo);
      }
      promedio.push(evolucion.promedioConsolidado);
      });
      this.dataSets.push({
        label: department.departamento,
        data: promedio,
        borderWidth: 1,
      });
    });
    this.labels = periodos;
  }

  recoverStatisticsQuestions() {
    const academicPeriodId = this.formStatistics.get('academicPeriod')?.value;
    const departmentId = this.formStatistics.get('department')?.value;
    const activityTypeId = this.formStatistics.get('activityType')?.value;
    const questionStatisticsResponse: QuestionStatisticsResponse = this.statisticsService.getStatisticsQuestions(academicPeriodId, departmentId, activityTypeId); 

    let preguntas: string[] = [];
    let promedios: number[] = [];
    questionStatisticsResponse.evaluacionPorPregunta.forEach((evaluacion) => {
      preguntas.push(evaluacion.pregunta);
      promedios.push(evaluacion.promedioCalificacion);
    });

    this.labels = preguntas;
    this.dataSets = [
      {
        label: 'Promedio por Pregunta',
        data: promedios,
        borderWidth: 1,
      },
    ];
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  reloadChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new ChartComponent();
  }

  validateUserExist(
    idUser: string | null,
    userName: string,
    rol: number | null,
    department: string | null,
    faculty: string | null
  ): void {
    if(!this.showUserNameDropdown){
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
    this.formStatistics
      .get('teacher')
      ?.setValue(user);
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
