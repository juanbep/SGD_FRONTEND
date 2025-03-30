import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import { ActivitiesTableComponent } from '../../components/activities-table/activities-table.component';
import { ActivitiesManagementService } from '../../services/activities-management.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ConfirmDialogComponent } from '../../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { debounceTime } from 'rxjs';
import { ActividadCreate } from '../../../../../../core/models/modified/actividad-create.model';
import { Atributo } from '../../../../../../core/models/base/atributo.model';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import {
  TIPO_ACTIVIDADES,
  ROLES,
} from '../../../../../../core/enums/domain-enums';

@Component({
  selector: 'app-new-activity',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ActivitiesTableComponent,
    ConfirmDialogComponent,
    RouterModule,
  ],
  templateUrl: './new-activity.component.html',
  styleUrl: './new-activity.component.css',
})
export class NewActivityComponent implements OnInit {
  @ViewChild(ConfirmDialogComponent)
  confirmDialogComponent: ConfirmDialogComponent | null = null;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private catalogDataService = inject(CatalogDataService);
  private validatorsService = inject(ValidatorsService);
  private activitiesManagementService = inject(ActivitiesManagementService);
  private activatedRoute = inject(ActivatedRoute);
  private messagesInfoService = inject(MessagesInfoService);

  public catalogResponse: CatalogDataResponse | null = null;
  public evaluator: UsuarioResponse | null = null;
  public idUserParam: number | null = null;
  public userByIdResponse: UsuarioResponse | null = null;
  public currentPage: number = 1;
  public sizePage: number = 10;

  public showEvaluatorIdDropdown: boolean = false;
  public showEvaluatorNameDropdown: boolean = false;

  public showNoReulstaSearchId: boolean = false;
  public showNoReulstaSearchName: boolean = false;
  public typeResulsSearchId: string = '';
  public typeResulsSearchName: string = '';

  public userResponse: PagedResponse<UsuarioResponse> | null = null;
  public userResponseSeachById: PagedResponse<UsuarioResponse> | null = null;
  public userResponseSeachByName: PagedResponse<UsuarioResponse> | null = null;

  public messageConfirmDialog: string = '¿Está seguro de crear la actividad?';
  public titleConfirmDialog: string = 'Confirmar creación de actividad';

  newActivityForm: FormGroup = this.formBuilder.group({
    nameActivity: [null],
    typeActivity: [null, Validators.required],
    codeActivity: [null, Validators.required],
    VRI: [null, Validators.required],
    subject: [null, Validators.required],
    group: [null, Validators.required],
    weeklyHours: [
      null,
      [
        Validators.required,
        this.validatorsService.validateNumericFormat,
        Validators.min(0),
      ],
    ],
    weeks: [
      null,
      [
        Validators.required,
        this.validatorsService.validateNumericFormat,
        Validators.min(0),
      ],
    ],
    projectName: [null, Validators.required],
    administrativeAct: [null, Validators.required],
    idStudent: [null, Validators.required],
    activity: [null, Validators.required],
    evaluatorName: [null, Validators.required],
    evaluatorId: [null, Validators.required],
    executiveReport: [null, Validators.required],
    activityState: [null, Validators.required],
  });

  ngOnInit(): void {
    this.idUserParam = this.activatedRoute.snapshot.params['id'];
    this.catalogResponse = this.catalogDataService.catalogDataSignal;
    this.disableFields();
    this.enableFields();
    this.clearFilterParams();
    this.recoverUserById(this.idUserParam);
    this.onChangeInfoEvaluator();
  }

  recoverCatalogData(): void {
    this.catalogResponse = this.catalogDataService.catalogDataSignal;
  }

  recoverUserById(id: number | null): void {
    if (id) {
      this.activitiesManagementService.getUserById(id).subscribe((response) => {
        this.userByIdResponse = response.data;
      });
    }
  }

  disableFields(): void {
    this.newActivityForm.get('nameActivity')?.disable();
    this.newActivityForm.get('codeActivity')?.disable();
    this.newActivityForm.get('VRI')?.disable();
    this.newActivityForm.get('subject')?.disable();
    this.newActivityForm.get('group')?.disable();
    this.newActivityForm.get('weeklyHours')?.disable();
    this.newActivityForm.get('weeks')?.disable();
    this.newActivityForm.get('projectName')?.disable();
    this.newActivityForm.get('administrativeAct')?.disable();
    this.newActivityForm.get('idStudent')?.disable();
    this.newActivityForm.get('activity')?.disable();
    this.newActivityForm.get('evaluatorName')?.disable();
    this.newActivityForm.get('evaluatorId')?.disable();
    this.newActivityForm.get('executiveReport')?.disable();
    this.newActivityForm.get('activityState')?.disable();
  }

  clearFields(): void {
    this.newActivityForm.get('nameActivity')?.reset();
    this.newActivityForm.get('codeActivity')?.reset();
    this.newActivityForm.get('VRI')?.reset();
    this.newActivityForm.get('subject')?.reset();
    this.newActivityForm.get('group')?.reset();
    this.newActivityForm.get('weeklyHours')?.reset();
    this.newActivityForm.get('weeks')?.reset();
    this.newActivityForm.get('projectName')?.reset();
    this.newActivityForm.get('administrativeAct')?.reset();
    this.newActivityForm.get('idStudent')?.reset();
    this.newActivityForm.get('activity')?.reset();
    this.newActivityForm.get('evaluatorName')?.reset();
    this.newActivityForm.get('evaluatorId')?.reset();
    this.newActivityForm.get('executiveReport')?.disable();
    this.newActivityForm.get('activityState')?.disable();
  }

  enableFields(): void {
    this.newActivityForm
      .get('typeActivity')
      ?.valueChanges.subscribe((value) => {
        this.disableFields();
        this.clearFields();
        switch (Number(value)) {
          //ASESORÍA
          case TIPO_ACTIVIDADES.ASESORIA:
            this.newActivityForm.get('nameActivity')?.enable();
            this.newActivityForm.get('administrativeAct')?.enable();
            this.newActivityForm.get('activity')?.enable();
            this.newActivityForm.get('weeklyHours')?.enable();
            this.newActivityForm.get('weeks')?.enable();
            this.newActivityForm.get('evaluatorId')?.enable();
            this.newActivityForm.get('evaluatorName')?.enable();
            this.newActivityForm.get('executiveReport')?.enable();
            this.newActivityForm.get('activityState')?.enable();
            this.validateEvaluator(TIPO_ACTIVIDADES.ASESORIA);

            break;

          //TRABAJOS DOCENCIA
          case TIPO_ACTIVIDADES.TRABAJO_DE_DOCENCIA:
            this.newActivityForm.get('nameActivity')?.enable();
            this.newActivityForm.get('administrativeAct')?.enable();
            this.newActivityForm.get('idStudent')?.enable();
            this.newActivityForm.get('weeklyHours')?.enable();
            this.newActivityForm.get('weeks')?.enable();
            this.newActivityForm.get('evaluatorName')?.enable();
            this.newActivityForm.get('evaluatorId')?.enable();
            this.newActivityForm.get('executiveReport')?.enable();
            this.newActivityForm.get('activityState')?.enable();
            this.validateEvaluator(TIPO_ACTIVIDADES.TRABAJO_DE_DOCENCIA);
            break;

          //PROYECTOS DE INVESTIGACIÓN
          case TIPO_ACTIVIDADES.PROYECTO_DE_INVESTIGACION:
            this.newActivityForm.get('nameActivity')?.enable();
            this.newActivityForm.get('VRI')?.enable();
            this.newActivityForm.get('projectName')?.enable();
            this.newActivityForm.get('weeklyHours')?.enable();
            this.newActivityForm.get('weeks')?.enable();
            this.newActivityForm.get('evaluatorName')?.enable();
            this.newActivityForm.get('evaluatorId')?.enable();
            this.newActivityForm.get('executiveReport')?.enable();
            this.newActivityForm.get('activityState')?.enable();
            this.validateEvaluator(TIPO_ACTIVIDADES.PROYECTO_DE_INVESTIGACION);
            break;

          //Capacitación
          case TIPO_ACTIVIDADES.CAPACITACION:
            this.newActivityForm.get('nameActivity')?.enable();
            this.newActivityForm.get('administrativeAct')?.enable();
            this.newActivityForm.get('activity')?.enable();
            this.newActivityForm.get('weeklyHours')?.enable();
            this.newActivityForm.get('weeks')?.enable();
            this.newActivityForm.get('evaluatorId')?.enable();
            this.newActivityForm.get('evaluatorName')?.enable();
            this.newActivityForm.get('executiveReport')?.enable();
            this.newActivityForm.get('activityState')?.enable();
            this.validateEvaluator(TIPO_ACTIVIDADES.CAPACITACION);
            break;

          //ADMINISTRACIÓN
          case TIPO_ACTIVIDADES.ADMINISTRACION:
            this.newActivityForm.get('nameActivity')?.enable();
            this.newActivityForm.get('administrativeAct')?.enable();
            this.newActivityForm.get('activity')?.enable();
            this.newActivityForm.get('weeklyHours')?.enable();
            this.newActivityForm.get('weeks')?.enable();
            this.newActivityForm.get('evaluatorId')?.enable();
            this.newActivityForm.get('evaluatorName')?.enable();
            this.newActivityForm.get('executiveReport')?.enable();
            this.newActivityForm.get('activityState')?.enable();
            this.validateEvaluator(TIPO_ACTIVIDADES.ADMINISTRACION);
            break;

          //OTROS SERVICIOS
          case TIPO_ACTIVIDADES.OTRO_SERVICIO:
            this.newActivityForm.get('nameActivity')?.enable();
            this.newActivityForm.get('administrativeAct')?.enable();
            this.newActivityForm.get('activity')?.enable();
            this.newActivityForm.get('weeklyHours')?.enable();
            this.newActivityForm.get('weeks')?.enable();
            this.newActivityForm.get('evaluatorId')?.enable();
            this.newActivityForm.get('evaluatorName')?.enable();
            this.newActivityForm.get('executiveReport')?.enable();
            this.newActivityForm.get('activityState')?.enable();
            this.validateEvaluator(TIPO_ACTIVIDADES.OTRO_SERVICIO);
            break;

          //EXTENSIÓN
          case TIPO_ACTIVIDADES.EXTENSION:
            this.newActivityForm.get('nameActivity')?.enable();
            this.newActivityForm.get('administrativeAct')?.enable();
            this.newActivityForm.get('weeks')?.enable();
            this.newActivityForm.get('weeklyHours')?.enable();
            this.newActivityForm.get('projectName')?.enable();
            this.newActivityForm.get('evaluatorName')?.enable();
            this.newActivityForm.get('evaluatorId')?.enable();
            this.newActivityForm.get('executiveReport')?.enable();
            this.newActivityForm.get('activityState')?.enable();
            this.validateEvaluator(TIPO_ACTIVIDADES.EXTENSION);
            break;

          //TRABAJOS DE INVESTIGACIÓN
          case TIPO_ACTIVIDADES.TRABAJO_DE_INVESTIGACION:
            this.newActivityForm.get('nameActivity')?.enable();
            this.newActivityForm.get('administrativeAct')?.enable();
            this.newActivityForm.get('idStudent')?.enable();
            this.newActivityForm.get('weeklyHours')?.enable();
            this.newActivityForm.get('weeks')?.enable();
            this.newActivityForm.get('evaluatorId')?.enable();
            this.newActivityForm.get('evaluatorName')?.enable();
            this.newActivityForm.get('executiveReport')?.enable();
            this.newActivityForm.get('activityState')?.enable();
            this.validateEvaluator(TIPO_ACTIVIDADES.TRABAJO_DE_INVESTIGACION);
            break;

          //DOCENCIA
          case TIPO_ACTIVIDADES.DOCENCIA:
            this.newActivityForm.get('nameActivity')?.enable();
            this.newActivityForm.get('codeActivity')?.enable();
            this.newActivityForm.get('subject')?.enable();
            this.newActivityForm.get('group')?.enable();
            this.newActivityForm.get('weeklyHours')?.enable();
            this.newActivityForm.get('weeks')?.enable();
            this.newActivityForm.get('evaluatorName')?.enable();
            this.newActivityForm.get('evaluatorId')?.enable();
            this.newActivityForm.get('executiveReport')?.enable();
            this.newActivityForm.get('activityState')?.enable();
            this.validateEvaluator(TIPO_ACTIVIDADES.DOCENCIA);
            break;
        }
      });
  }

  isDisabledField(field: string) {
    return this.newActivityForm.get(field)?.disabled;
  }

  isInvaldField(field: string) {
    const control = this.newActivityForm.get(field);
    return (
      control &&
      control.errors &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  goBack(): void {
    window.history.back();
  }

  getFieldError(field: string): string | null {
    if (!this.newActivityForm.controls[field]) return null;
    const control = this.newActivityForm.controls[field];
    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'email':
          return 'El email no es válido';
        case 'invalidNumber':
          return 'El campo solo acepta números';
        case 'min':
          return 'El valor mínimo es 0';
        case 'max':
          return 'El valor máximo es 100';
        default:
          return null;
      }
    }
    return null;
  }

  validateEvaluator(typeActivity: TIPO_ACTIVIDADES) {
    switch (typeActivity) {
      case TIPO_ACTIVIDADES.CAPACITACION:
        if (this.userByIdResponse) {
          this.validateUserExist(
            'USERDEPARTMENTBOSS',
            '',
            '',
            ROLES.JEFE_DE_DEPARTAMENTO,
            this.userByIdResponse.usuarioDetalle.departamento
              ? this.userByIdResponse.usuarioDetalle.departamento
              : '',
            ''
          );
        }
        break;
      case TIPO_ACTIVIDADES.DOCENCIA:
        if (this.userByIdResponse) {
          this.validateUserExist(
            'USERDEPARTMENTBOSS',
            '',
            '',
            ROLES.JEFE_DE_DEPARTAMENTO,
            this.userByIdResponse.usuarioDetalle.departamento
              ? this.userByIdResponse.usuarioDetalle.departamento
              : '',
            ''
          );
        }
        break;
      case TIPO_ACTIVIDADES.TRABAJO_DE_DOCENCIA:
        this.listenerIdStudent();
        break;
      case TIPO_ACTIVIDADES.PROYECTO_DE_INVESTIGACION:
        break;
      case TIPO_ACTIVIDADES.TRABAJO_DE_INVESTIGACION:
        this.listenerIdStudent();
        break;
      case TIPO_ACTIVIDADES.ADMINISTRACION:
        if (this.userByIdResponse) {
          this.validateUserExist(
            'DECANO',
            '',
            '',
            ROLES.DECANO,
            this.userByIdResponse.usuarioDetalle.departamento
              ? this.userByIdResponse.usuarioDetalle.departamento
              : '',
            'INGENIERÍA ELECTRÓNICA Y TELECOMUNICACIONES'
          );
        }
        break;
      case TIPO_ACTIVIDADES.ASESORIA:
        if (this.userByIdResponse) {
          this.validateUserExist(
            'USERDEPARTMENTBOSS',
            '',
            '',
            ROLES.JEFE_DE_DEPARTAMENTO,
            this.userByIdResponse.usuarioDetalle.departamento
              ? this.userByIdResponse.usuarioDetalle.departamento
              : '',
            ''
          );
        }
        break;
      case TIPO_ACTIVIDADES.EXTENSION:
        if (this.userByIdResponse) {
          this.validateUserExist(
            'USERDEPARTMENTBOSS',
            '',
            '',
            ROLES.JEFE_DE_DEPARTAMENTO,
            this.userByIdResponse.usuarioDetalle.departamento
              ? this.userByIdResponse.usuarioDetalle.departamento
              : '',
            ''
          );
        }
        break;
      case TIPO_ACTIVIDADES.OTRO_SERVICIO:
        if (this.userByIdResponse) {
          this.validateUserExist(
            'USERDEPARTMENTBOSS',
            '',
            '',
            ROLES.JEFE_DE_DEPARTAMENTO,
            this.userByIdResponse.usuarioDetalle.departamento
              ? this.userByIdResponse.usuarioDetalle.departamento
              : '',
            ''
          );
        }
        break;
    }
  }

  onConfirm(event: any): void {
    if (event) {
      this.newActivityForm.markAllAsTouched();
      if (this.idUserParam && this.newActivityForm.valid) {
        const atributos: Atributo[] = [];
        if (this.newActivityForm.get('group')?.value) {
          atributos.push({
            codigoAtributo: 'GRUPO',
            valor: this.newActivityForm.get('group')?.value,
          });
        }
        if (this.newActivityForm.get('activity')?.value) {
          atributos.push({
            codigoAtributo: 'ACTIVIDAD',
            valor: this.newActivityForm.get('activity')?.value,
          });
        }
        if (this.newActivityForm.get('codeActivity')?.value) {
          atributos.push({
            codigoAtributo: 'CODIGO',
            valor: this.newActivityForm.get('codeActivity')?.value,
          });
        }
        if (this.newActivityForm.get('VRI')?.value) {
          atributos.push({
            codigoAtributo: 'VRI',
            valor: this.newActivityForm.get('VRI')?.value,
          });
        }
        if (this.newActivityForm.get('administrativeAct')?.value) {
          atributos.push({
            codigoAtributo: 'ACTOADMINISTRATIVO',
            valor: this.newActivityForm.get('administrativeAct')?.value,
          });
        }
        if (this.newActivityForm.get('projectName')?.value) {
          atributos.push({
            codigoAtributo: 'NOMBREPROYECTO',
            valor: this.newActivityForm.get('projectName')?.value,
          });
        }
        if (this.newActivityForm.get('subject')?.value) {
          atributos.push({
            codigoAtributo: 'MATERIA',
            valor: this.newActivityForm.get('subject')?.value,
          });
        }
        const newActivity: ActividadCreate[] = [{
          tipoActividad: {
            oidTipoActividad: Number(
              this.newActivityForm.get('typeActivity')?.value
            ),
          },
          oidEvaluado: Number(this.idUserParam),
          oidEvaluador: Number(this.evaluator?.oidUsuario || 0),
          oidEstadoActividad: Number(
            this.newActivityForm.get('activityState')?.value
          ),
          nombreActividad: this.newActivityForm.get('nameActivity')?.value,
          horas: Number(this.newActivityForm.get('weeklyHours')?.value),
          semanas: Number(this.newActivityForm.get('weeks')?.value),
          informeEjecutivo: this.newActivityForm.get('executiveReport')?.value,
          atributos: atributos,
        }];
        this.activitiesManagementService
          .saveNewActivity(newActivity)
          .subscribe({
            next: (response) => {
              this.messagesInfoService.showSuccessMessage(
                'Actividad guardada correctamente',
                'Éxito'
              );
              this.newActivityForm.reset();
              this.userResponseSeachById = null;
              this.userResponseSeachByName = null;
              this.userResponse = null;
              this.recoverActivitiesByUser();
            },
            error: (error) => {
              this.messagesInfoService.showErrorMessage(
                error.error.mensaje,
                'Error'
              );
            },
          });
      } else {
        this.messagesInfoService.showWarningMessage(
          'Por favor, verifica los campos',
          'Advertencia'
        );
      }
    }
  }

  clearFilterParams(): void {
    this.activitiesManagementService.setParamsActivitiesFilter({
      nameActivity: '',
      typeActivity: '',
      activityCode: '',
      administrativeCode: '',
      vriCode: '',
    });
  }

  listenerIdStudent(): void {
    this.newActivityForm
      .get('idStudent')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        if (value) {
          this.validateUserExist(
            'USERSTUDENT',
            value,
            '',
            ROLES.ESTUDIANTE,
            '',
            ''
          );
        }
      });
  }

  validateUserExist(
    typeValidation: string,
    idUser: string,
    userName: string,
    rol: number,
    department: string | null,
    faculty: string | null
  ): void {
    switch (typeValidation) {
      case 'USERSBYID':
        if (idUser) {
          this.activitiesManagementService
            .getUserByParams(0, 3, idUser, '', '', '', '', '', '', '', '', '1')
            .subscribe({
              next: (response) => {
                this.userResponseSeachById = response.data;
              },
              error: (error) => {
                this.userResponseSeachById = null;
              },
            });
        }
        break;
      case 'USERSBYNAME':
        if (userName) {
          this.activitiesManagementService
            .getUserByParams(
              0,
              3,
              '',
              userName,
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              '1'
            )
            .subscribe({
              next: (response) => {
                this.userResponseSeachByName = response.data;
              },
              error: (error) => {
                this.userResponseSeachByName = null;
              },
            });
        }
        break;
      case 'USERSTUDENT':
        if (idUser) {
          this.activitiesManagementService
            .getUserByParams(0, 3, idUser, '', '', '', '', '', '', '', '2', '1')
            .subscribe({
              next: (response) => {
                this.userResponse = response.data;
                if (this.userResponse) {
                  this.evaluator = this.userResponse.content[0];
                  this.newActivityForm
                    .get('evaluatorName')
                    ?.setValue(
                      this.userResponse.content[0].nombres +
                        ' ' +
                        this.userResponse.content[0].apellidos
                    );
                  this.newActivityForm
                    .get('evaluatorId')
                    ?.setValue(this.userResponse.content[0].identificacion);
                } else {
                  this.evaluator = null;
                  this.newActivityForm.get('evaluatorName')?.setValue(null);
                  this.newActivityForm.get('evaluatorId')?.setValue(null);
                }
              },
              error: (error) => {
                this.userResponse = null;
              },
            });
        }
        break;
      case 'USERDEPARTMENTBOSS':
        if (rol && department) {
          this.activitiesManagementService
            .getUserByParams(
              0,
              3,
              '',
              '',
              '',
              department,
              '',
              '',
              '',
              '',
              rol.toString(),
              '1'
            )
            .subscribe({
              next: (response) => {
                this.userResponse = response.data;
                if (this.userResponse) {
                  this.evaluator = this.userResponse.content[0];
                  this.newActivityForm
                    .get('evaluatorName')
                    ?.setValue(
                      this.userResponse.content[0].nombres +
                        ' ' +
                        this.userResponse.content[0].apellidos
                    );
                  this.newActivityForm
                    .get('evaluatorId')
                    ?.setValue(this.userResponse.content[0].identificacion);
                } else {
                  this.evaluator = null;
                  this.newActivityForm.get('evaluatorName')?.setValue(null);
                  this.newActivityForm.get('evaluatorId')?.setValue(null);
                }
              },
              error: (error) => {
                this.userResponse = null;
              },
            });
        }
        break;
      case 'DECANO':
        if (rol && faculty) {
          this.activitiesManagementService
            .getUserByParams(
              0,
              3,
              '',
              '',
              faculty,
              '',
              '',
              '',
              '',
              '',
              rol.toString(),
              '1'
            )
            .subscribe({
              next: (response) => {
                this.userResponse = response.data;
                if (this.userResponse) {
                  this.evaluator = this.userResponse.content[0];
                  this.newActivityForm
                    .get('evaluatorName')
                    ?.setValue(
                      this.userResponse.content[0].nombres +
                        ' ' +
                        this.userResponse.content[0].apellidos
                    );
                  this.newActivityForm
                    .get('evaluatorId')
                    ?.setValue(this.userResponse.content[0].identificacion);
                } else {
                  this.evaluator = null;
                  this.newActivityForm.get('evaluatorName')?.setValue(null);
                  this.newActivityForm.get('evaluatorId')?.setValue(null);
                }
              },
              error: (error) => {
                this.userResponse = null;
              },
            });
          break;
        }
    }
  }

  selectUser(user: UsuarioResponse | null): void {
    if (user) {
      this.evaluator = user;
      this.newActivityForm
        .get('evaluatorName')
        ?.setValue(user?.nombres + ' ' + user?.apellidos);
      this.newActivityForm.get('evaluatorId')?.setValue(user?.identificacion);
      if (
        this.newActivityForm.get('typeActivity')?.value === '2' ||
        this.newActivityForm.get('typeActivity')?.value === '8'
      ) {
        this.newActivityForm.get('idStudent')?.setValue(user?.identificacion);
      }
    }
  }

  openConfirmDialog(): void {
    this.confirmDialogComponent?.open();
  }

  recoverActivitiesByUser() {
    if (this.idUserParam) {
      this.activitiesManagementService.setParamsActivitiesFilter({
        nameActivity: '',
        typeActivity: '',
        activityCode: '',
        administrativeCode: '',
        vriCode: '',
      });
    }
  }

  showDropdownEvaluatorIdList(): void {
    this.showEvaluatorIdDropdown = true;
  }

  hideDropdownEvaluatorIdList(): void {
    setTimeout(() => {
      this.showEvaluatorIdDropdown = false;
      if (!this.userResponseSeachById) {
        this.newActivityForm.get('evaluatorId')?.setValue('');
        this.newActivityForm.get('evaluatorName')?.setValue('');
        this.newActivityForm.get('idStudent')?.setValue('');
        this.evaluator = null;
        this.userResponseSeachByName = null;
      }
    }, 100);
  }

  showDropdownEvaluatorNameList(): void {
    this.showEvaluatorNameDropdown = true;
  }

  hideDropdownEvaluatorNameList(): void {
    setTimeout(() => {
      this.showEvaluatorNameDropdown = false;
      if (!this.userResponseSeachByName) {
        this.newActivityForm.get('evaluatorId')?.setValue('');
        this.newActivityForm.get('evaluatorName')?.setValue('');
        this.newActivityForm.get('idStudent')?.setValue('');
        this.evaluator = null;
        this.userResponseSeachById = null;
      }
    }, 100);
  }

  onChangeInfoEvaluator() {
    this.newActivityForm
      .get('evaluatorId')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        this.typeResulsSearchId = value;
        if (value) {
          this.validateUserExist('USERSBYID', value, '', 0, '', '');
        } else {
          this.userResponseSeachById = null;
        }
      });

    this.newActivityForm
      .get('evaluatorName')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((value) => {
        this.typeResulsSearchName = value;
        if (value) {
          this.validateUserExist('USERSBYNAME', '', value, 0, '', '');
        } else {
          this.userResponseSeachByName = null;
        }
      });
  }
}
