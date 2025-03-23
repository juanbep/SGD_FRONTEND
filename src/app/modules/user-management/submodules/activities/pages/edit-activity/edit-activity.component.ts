import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ActivitiesManagementService } from '../../services/activities-management.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { CommonModule } from '@angular/common';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { debounceTime } from 'rxjs';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';
import { ActividadResponse } from '../../../../../../core/models/response/actividad-response.model';
import { ActividadCreate } from '../../../../../../core/models/modified/actividad-create.model';
import { TIPO_ACTIVIDADES, ROLES } from '../../../../../../core/enums/domain-enums';

@Component({
  selector: 'app-edit-activity',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ConfirmDialogComponent,
  ],
  templateUrl: './edit-activity.component.html',
  styleUrl: './edit-activity.component.css',
})
export class EditActivityComponent implements OnInit {
  @ViewChild(ConfirmDialogComponent)
  confirmDialogComponent: ConfirmDialogComponent | null = null;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private activatedRoute = inject(ActivatedRoute);
  private activitiesManagementService = inject(ActivitiesManagementService);
  private messagesInfoService = inject(MessagesInfoService);
  private catalogDataService = inject(CatalogDataService);

  public idActivityParam: number | null = null;
  public activity: ActividadResponse | null = null;
  public catalogResponse: CatalogDataResponse | null = null;
  public evaluator: UsuarioResponse | null = null;
  public userByIdResponse: UsuarioResponse | null = null;

  public showEvaluatorIdDropdown: boolean = false;
  public showEvaluatorNameDropdown: boolean = false;
  public typeResulsSearchId: string = '';
  public typeResulsSearchName: string = '';

  public userResponse: PagedResponse<UsuarioResponse> | null = null;
  public userResponseSeachById: PagedResponse<UsuarioResponse> | null = null;
  public userResponseSeachByName: PagedResponse<UsuarioResponse> | null = null;

  public messageConfirmDialog: string = '¿Está seguro de editar la actividad?';
  public titleConfirmDialog: string = 'Confirmar edición de actividad';

  activityForm: FormGroup = this.formBuilder.group({
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
    this.idActivityParam = this.activatedRoute.snapshot.params['id'];
    this.catalogResponse = this.catalogDataService.catalogDataSignal;
    this.recoverInfoActivity();
    this.onChangeInfoEvaluator();

  }

  recoverUserById(id: number | null): void {
    if (id) {
      this.activitiesManagementService.getUserById(id).subscribe((response) => {
        this.userByIdResponse = response.data;
      });
    }
  }

  recoverInfoActivity() {
    this.enableFields();
    if (this.idActivityParam) {
      this.activitiesManagementService
        .getActivityById(this.idActivityParam)
        .subscribe({
          next: (response) => {
            this.activity = response;
            this.setDefaultValues();
            this.recoverUserById(this.activity.oidEvaluado);
          },
          error: (error) => {
            this.messagesInfoService.showErrorMessage(
              'No se pudo recuperar la información de la actividad',
              'Error'
            );
          },
        });
    }
  }

  recoverCatalogData(): void {
    this.catalogResponse = this.catalogDataService.catalogDataSignal;
  }

  setDefaultValues() {
    if (this.activity) {
      this.activityForm
        .get('typeActivity')
        ?.setValue(this.activity.tipoActividad.oidTipoActividad);
      this.activityForm
        .get('nameActivity')
        ?.setValue(this.activity.nombreActividad);
      for (let atributo of this.activity.atributos) {
        if (atributo.codigoAtributo === 'CODIGO') {
          this.activityForm.get('codeActivity')?.setValue(atributo.valor);
        }
        if (atributo.codigoAtributo === 'ACTO_ADMINISTRATIVO') {
          this.activityForm.get('administrativeAct')?.setValue(atributo.valor);
        }
        if (atributo.codigoAtributo === 'VRI') {
          this.activityForm.get('VRI')?.setValue(atributo.valor);
        }
        if (atributo.codigoAtributo === 'ACTIVIDAD') {
          this.activityForm.get('activity')?.setValue(atributo.valor);
        }
        if (atributo.codigoAtributo === 'GRUPO') {
          this.activityForm.get('group')?.setValue(atributo.valor);
        }
        if (atributo.codigoAtributo === 'MATERIA') {
          this.activityForm.get('subject')?.setValue(atributo.valor);
        }
        if (atributo.codigoAtributo === 'NOMBRE_PROYECTO') {
          this.activityForm.get('projectName')?.setValue(atributo.valor);
        }
      }
      this.activityForm
        .get('weeklyHours')
        ?.setValue(this.activity.horas.toString());
      this.activityForm
        .get('weeks')
        ?.setValue(this.activity.semanas.toString());
      if (
        this.activity.tipoActividad.oidTipoActividad === 2 ||
        this.activity.tipoActividad.oidTipoActividad === 8
      ) {
        this.activityForm
          .get('idStudent')
          ?.setValue(this.activity.evaluador.identificacion);
      }
      this.activityForm.get('evaluatorName')?.setValue(this.activity.evaluador);
      this.activityForm
        .get('executiveReport')
        ?.setValue(this.activity.informeEjecutivo ? 'TRUE' : 'FALSE');
      this.activityForm
        .get('activityState')
        ?.setValue(this.activity.oidEstadoActividad);
      this.activityForm
        .get('evaluatorId')
        ?.setValue(this.activity.evaluador.identificacion);
      this.activityForm
        .get('evaluatorName')
        ?.setValue(
          this.activity.evaluador.nombres +
            ' ' +
            this.activity.evaluador.apellidos
        );
    }
  }

  enableFields(): void {
    this.activityForm.get('typeActivity')?.valueChanges.subscribe((value) => {
      this.disableFields();
      this.clearFields();
      const typeActivity = Number(value);
      switch (typeActivity) {
        case TIPO_ACTIVIDADES.ASESORIA:
          this.activityForm.get('nameActivity')?.enable();
          this.activityForm.get('administrativeAct')?.enable();
          this.activityForm.get('activity')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('weeks')?.enable();
          this.activityForm.get('evaluatorId')?.enable();
          this.activityForm.get('evaluatorName')?.enable();
          this.activityForm.get('executiveReport')?.enable();
          this.activityForm.get('activityState')?.enable();
          this.validateEvaluator(TIPO_ACTIVIDADES.ASESORIA);
          break;
        case TIPO_ACTIVIDADES.TRABAJO_DE_DOCENCIA:
          this.activityForm.get('nameActivity')?.enable();
          this.activityForm.get('administrativeAct')?.enable();
          this.activityForm.get('idStudent')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('weeks')?.enable();
          this.activityForm.get('evaluatorName')?.enable();
          this.activityForm.get('evaluatorId')?.enable();
          this.activityForm.get('executiveReport')?.enable();
          this.activityForm.get('activityState')?.enable();
          this.validateEvaluator(TIPO_ACTIVIDADES.TRABAJO_DE_DOCENCIA);
          break;
        case TIPO_ACTIVIDADES.PROYECTO_DE_INVESTIGACION:
          this.activityForm.get('nameActivity')?.enable();
          this.activityForm.get('VRI')?.enable();
          this.activityForm.get('projectName')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('weeks')?.enable();
          this.activityForm.get('evaluatorName')?.enable();
          this.activityForm.get('evaluatorId')?.enable();
          this.activityForm.get('executiveReport')?.enable();
          this.activityForm.get('activityState')?.enable();
          this.validateEvaluator(TIPO_ACTIVIDADES.PROYECTO_DE_INVESTIGACION);
          break;
        case TIPO_ACTIVIDADES.CAPACITACION:
          this.activityForm.get('nameActivity')?.enable();
          this.activityForm.get('administrativeAct')?.enable();
          this.activityForm.get('activity')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('weeks')?.enable();
          this.activityForm.get('evaluatorId')?.enable();
          this.activityForm.get('evaluatorName')?.enable();
          this.activityForm.get('executiveReport')?.enable();
          this.activityForm.get('activityState')?.enable();
          this.validateEvaluator(TIPO_ACTIVIDADES.CAPACITACION);
          break;
        case TIPO_ACTIVIDADES.ADMINISTRACION:
          this.activityForm.get('nameActivity')?.enable();
          this.activityForm.get('administrativeAct')?.enable();
          this.activityForm.get('activity')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('weeks')?.enable();
          this.activityForm.get('evaluatorId')?.enable();
          this.activityForm.get('evaluatorName')?.enable();
          this.activityForm.get('executiveReport')?.enable();
          this.activityForm.get('activityState')?.enable();
          this.validateEvaluator(TIPO_ACTIVIDADES.ADMINISTRACION);
          break;
        case TIPO_ACTIVIDADES.OTRO_SERVICIO:
          this.activityForm.get('nameActivity')?.enable();
          this.activityForm.get('administrativeAct')?.enable();
          this.activityForm.get('activity')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('weeks')?.enable();
          this.activityForm.get('evaluatorId')?.enable();
          this.activityForm.get('evaluatorName')?.enable();
          this.activityForm.get('executiveReport')?.enable();
          this.activityForm.get('activityState')?.enable();
          this.validateEvaluator(TIPO_ACTIVIDADES.OTRO_SERVICIO);
          break;
        case TIPO_ACTIVIDADES.EXTENSION:
          this.activityForm.get('nameActivity')?.enable();
          this.activityForm.get('administrativeAct')?.enable();
          this.activityForm.get('weeks')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('projectName')?.enable();
          this.activityForm.get('evaluatorName')?.enable();
          this.activityForm.get('evaluatorId')?.enable();
          this.activityForm.get('executiveReport')?.enable();
          this.activityForm.get('activityState')?.enable();
          this.validateEvaluator(TIPO_ACTIVIDADES.EXTENSION);
          break;
        case TIPO_ACTIVIDADES.TRABAJO_DE_INVESTIGACION:
          this.activityForm.get('nameActivity')?.enable();
          this.activityForm.get('administrativeAct')?.enable();
          this.activityForm.get('idStudent')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('weeks')?.enable();
          this.activityForm.get('evaluatorId')?.enable();
          this.activityForm.get('evaluatorName')?.enable();
          this.activityForm.get('executiveReport')?.enable();
          this.activityForm.get('activityState')?.enable();
          this.validateEvaluator(TIPO_ACTIVIDADES.TRABAJO_DE_INVESTIGACION);
          break;
        case TIPO_ACTIVIDADES.DOCENCIA:
          this.activityForm.get('nameActivity')?.enable();
          this.activityForm.get('codeActivity')?.enable();
          this.activityForm.get('subject')?.enable();
          this.activityForm.get('group')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('weeks')?.enable();
          this.activityForm.get('evaluatorName')?.enable();
          this.activityForm.get('evaluatorId')?.enable();
          this.activityForm.get('executiveReport')?.enable();
          this.activityForm.get('activityState')?.enable();
          this.validateEvaluator(TIPO_ACTIVIDADES.DOCENCIA);
          break;
        default:
          break;
      }
    });
  }

  clearFields(): void {
    this.activityForm.get('nameActivity')?.reset();
    this.activityForm.get('codeActivity')?.reset();
    this.activityForm.get('VRI')?.reset();
    this.activityForm.get('subject')?.reset();
    this.activityForm.get('group')?.reset();
    this.activityForm.get('weeklyHours')?.reset();
    this.activityForm.get('weeks')?.reset();
    this.activityForm.get('projectName')?.reset();
    this.activityForm.get('administrativeAct')?.reset();
    this.activityForm.get('idStudent')?.reset();
    this.activityForm.get('activity')?.reset();
    this.activityForm.get('evaluatorName')?.reset();
    this.activityForm.get('evaluatorId')?.reset();
    this.activityForm.get('executiveReport')?.disable();
    this.activityForm.get('activityState')?.disable();
  }

  disableFields(): void {
    this.activityForm.get('nameActivity')?.disable();
    this.activityForm.get('codeActivity')?.disable();
    this.activityForm.get('VRI')?.disable();
    this.activityForm.get('subject')?.disable();
    this.activityForm.get('group')?.disable();
    this.activityForm.get('weeklyHours')?.disable();
    this.activityForm.get('weeks')?.disable();
    this.activityForm.get('projectName')?.disable();
    this.activityForm.get('administrativeAct')?.disable();
    this.activityForm.get('idStudent')?.disable();
    this.activityForm.get('activity')?.disable();
    this.activityForm.get('evaluatorName')?.disable();
    this.activityForm.get('evaluatorId')?.disable();
    this.activityForm.get('executiveReport')?.disable();
    this.activityForm.get('activityState')?.disable();
  }

  isDisabledField(field: string) {
    return this.activityForm.get(field)?.disabled;
  }

  isInvaldField(field: string) {
    const control = this.activityForm.get(field);
    return (
      control &&
      control.errors &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  getFieldError(field: string): string | null {
    if (!this.activityForm.controls[field]) return null;
    const control = this.activityForm.controls[field];
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

  listenerIdStudent(): void {
    this.activityForm
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
                  this.activityForm
                    .get('evaluatorName')
                    ?.setValue(
                      this.userResponse.content[0].nombres +
                        ' ' +
                        this.userResponse.content[0].apellidos
                    );
                  this.activityForm
                    .get('evaluatorId')
                    ?.setValue(this.userResponse.content[0].identificacion);
                } else {
                  this.evaluator = null;
                  this.activityForm.get('evaluatorName')?.setValue(null);
                  this.activityForm.get('evaluatorId')?.setValue(null);
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
                  this.activityForm
                    .get('evaluatorName')
                    ?.setValue(
                      this.userResponse.content[0].nombres +
                        ' ' +
                        this.userResponse.content[0].apellidos
                    );
                  this.activityForm
                    .get('evaluatorId')
                    ?.setValue(this.userResponse.content[0].identificacion);
                } else {
                  this.evaluator = null;
                  this.activityForm.get('evaluatorName')?.setValue(null);
                  this.activityForm.get('evaluatorId')?.setValue(null);
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
                  this.activityForm
                    .get('evaluatorName')
                    ?.setValue(
                      this.userResponse.content[0].nombres +
                        ' ' +
                        this.userResponse.content[0].apellidos
                    );
                  this.activityForm
                    .get('evaluatorId')
                    ?.setValue(this.userResponse.content[0].identificacion);
                } else {
                  this.evaluator = null;
                  this.activityForm.get('evaluatorName')?.setValue(null);
                  this.activityForm.get('evaluatorId')?.setValue(null);
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
      this.activityForm
        .get('evaluatorName')
        ?.setValue(user?.nombres + ' ' + user?.apellidos);
      this.activityForm.get('evaluatorId')?.setValue(user?.identificacion);
    }
  }

  showDropdownEvaluatorIdList(): void {
    this.showEvaluatorIdDropdown = true;
  }

  hideDropdownEvaluatorIdList(): void {
    setTimeout(() => {
      this.showEvaluatorIdDropdown = false;
      if (!this.userResponseSeachById) {
        this.activityForm.get('evaluatorId')?.setValue('');
        this.activityForm.get('evaluatorName')?.setValue('');
        this.activityForm.get('idStudent')?.setValue('');
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
        this.activityForm.get('evaluatorId')?.setValue('');
        this.activityForm.get('evaluatorName')?.setValue('');
        this.activityForm.get('idStudent')?.setValue('');
        this.evaluator = null;
        this.userResponseSeachById = null;
      }
    }, 100);
  }

  onChangeInfoEvaluator() {
    this.activityForm
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

    this.activityForm
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

  onConfirm(event: any): void {
    if (event) {
      this.activityForm.markAllAsTouched();
      if (this.activity && this.activityForm.valid) {
        const newActivity: ActividadCreate = {
          tipoActividad: {
            oidTipoActividad: Number(
              this.activityForm.get('typeActivity')?.value
            ),
          },
          oidEvaluado: Number(this.activity.oidEvaluado),
          oidEvaluador: Number(this.evaluator?.oidUsuario || 0),
          oidEstadoActividad: Number(
            this.activityForm.get('activityState')?.value
          ),
          nombreActividad: this.activityForm.get('nameActivity')?.value,
          horas: Number(this.activityForm.get('weeklyHours')?.value),
          semanas: Number(this.activityForm.get('weeks')?.value),
          informeEjecutivo: this.activityForm.get('executiveReport')?.value,
          atributos: [
            {
              codigoAtributo: 'CODIGO',
              valor: this.activityForm.get('codeActivity')?.value,
            },
            {
              codigoAtributo: 'ACTO_ADMINISTRATIVO',
              valor: this.activityForm.get('administrativeAct')?.value,
            },
            {
              codigoAtributo: 'VRI',
              valor: this.activityForm.get('VRI')?.value,
            },
            {
              codigoAtributo: 'ACTIVIDAD',
              valor: this.activityForm.get('activity')?.value,
            },
            {
              codigoAtributo: 'GRUPO',
              valor: this.activityForm.get('group')?.value,
            },
            {
              codigoAtributo: 'MATERIA',
              valor: this.activityForm.get('subject')?.value,
            },
            {
              codigoAtributo: 'NOMBRE_PROYECTO',
              valor: this.activityForm.get('projectName')?.value,
            },
          ],
        };
        this.activitiesManagementService
          .updateActivity(this.activity.oidActividad, newActivity)
          .subscribe({
            next: (response) => {
              this.messagesInfoService.showSuccessMessage(
                'Actividad editada correctamente',
                'Éxito'
              );
              this.recoverInfoActivity();
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

  openConfirmDialog(): void {
    this.confirmDialogComponent?.open();
  }

  goBack(): void {
    window.history.back();
  }
}
