import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import { ActivitiesTableComponent } from "../../components/activities-table/activities-table.component";
import { ActivitiesManagementService } from '../../services/activities-management.service';
import { User, UsersResponse } from '../../../../../../core/models/users.interfaces';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NewActivity } from '../../../../../../core/models/activities.interface';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ConfirmDialogComponent } from "../../../../../../shared/components/confirm-dialog/confirm-dialog.component";
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-new-activity',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ActivitiesTableComponent,
    ConfirmDialogComponent,
    RouterModule
  ],
  templateUrl: './new-activity.component.html',
  styleUrl: './new-activity.component.css'
})
export class NewActivityComponent implements OnInit {

  @ViewChild(ConfirmDialogComponent) confirmDialogComponent: ConfirmDialogComponent | null = null;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private catalogDataService = inject(CatalogDataService);
  private validatorsService = inject(ValidatorsService);
  private activitiesManagementService = inject(ActivitiesManagementService);
  private activatedRoute = inject(ActivatedRoute);
  private messagesInfoService = inject(MessagesInfoService);

  public catalogResponse: CatalogDataResponse | null = null;
  public evaluator: User | null = null;
  public idUserParam: number | null = null;
  public userByIdResponse: User | null = null;
  public currentPage: number = 1;
  public sizePage: number = 10;

  public showEvaluatorIdDropdown: boolean = false;
  public showEvaluatorNameDropdown: boolean = false;

  public showNoReulstaSearchId: boolean = false;
  public showNoReulstaSearchName: boolean = false;
  public typeResulsSearchId: string = '';
  public typeResulsSearchName: string = '';


  public userResponse: UsersResponse | null = null;
  public userResponseSeachById: UsersResponse | null = null;
  public userResponseSeachByName: UsersResponse | null = null;



  public messageConfirmDialog: string = '¿Está seguro de crear la actividad?';
  public titleConfirmDialog: string = 'Confirmar creación de actividad';

  newActivityForm: FormGroup = this.formBuilder.group({
    nameActivity: [null],
    typeActivity: [null, Validators.required],
    codeActivity: [null, Validators.required],
    VRI: [null, Validators.required],
    subject: [null, Validators.required],
    group: [null, Validators.required],
    weeklyHours: [null, [Validators.required, this.validatorsService.validateNumericFormat, Validators.min(0)]],
    weeks: [null, [Validators.required, this.validatorsService.validateNumericFormat, Validators.min(0)]],
    projectName: [null, Validators.required],
    administrativeAct: [null, Validators.required],
    idStudent: [null, Validators.required],
    activity: [null, Validators.required],
    evaluatorName: [null, Validators.required],
    evaluatorId: [null, Validators.required],
    executiveReport: [null, Validators.required],
    activityState: [null, Validators.required]
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
        this.userByIdResponse = response;
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
    this.newActivityForm.get('typeActivity')?.valueChanges.subscribe((value) => {
      this.disableFields();
      this.clearFields();
      switch (value) {
        //DOCENCIA
        case '1':
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
          this.validateEvaluator('DOCENCIA');
          break;
        //TRABAJOS DOCENCIA
        case '2':
          this.newActivityForm.get('nameActivity')?.enable();
          this.newActivityForm.get('administrativeAct')?.enable();
          this.newActivityForm.get('idStudent')?.enable();
          this.newActivityForm.get('weeklyHours')?.enable();
          this.newActivityForm.get('weeks')?.enable();
          this.newActivityForm.get('evaluatorName')?.enable();
          this.newActivityForm.get('evaluatorId')?.enable();
          this.newActivityForm.get('executiveReport')?.enable();
          this.newActivityForm.get('activityState')?.enable();
          this.validateEvaluator('TRABAJOS DOCENCIA');
          break;
        //PROYECTOS DE INVESTIGACIÓN
        case '3':
          this.newActivityForm.get('nameActivity')?.enable();
          this.newActivityForm.get('VRI')?.enable();
          this.newActivityForm.get('projectName')?.enable();
          this.newActivityForm.get('weeklyHours')?.enable();
          this.newActivityForm.get('weeks')?.enable();
          this.newActivityForm.get('evaluatorName')?.enable();
          this.newActivityForm.get('evaluatorId')?.enable();
          this.newActivityForm.get('executiveReport')?.enable();
          this.newActivityForm.get('activityState')?.enable();
          this.validateEvaluator('PROYECTOS DE INVESTIGACIÓN');

          break;

        //TRABAJOS DE INVESTIGACIÓN
        case '8':
          this.newActivityForm.get('nameActivity')?.enable();
          this.newActivityForm.get('administrativeAct')?.enable();
          this.newActivityForm.get('idStudent')?.enable();
          this.newActivityForm.get('weeklyHours')?.enable();
          this.newActivityForm.get('weeks')?.enable();
          this.newActivityForm.get('evaluatorId')?.enable();
          this.newActivityForm.get('evaluatorName')?.enable();
          this.newActivityForm.get('executiveReport')?.enable();
          this.newActivityForm.get('activityState')?.enable();
          this.validateEvaluator('TRABAJOS DE INVESTIGACIÓN');
          break;
        //ADMINISTRACIÓN
        case '5':
          this.newActivityForm.get('nameActivity')?.enable();
          this.newActivityForm.get('administrativeAct')?.enable();
          this.newActivityForm.get('activity')?.enable();
          this.newActivityForm.get('weeklyHours')?.enable();
          this.newActivityForm.get('weeks')?.enable();
          this.newActivityForm.get('evaluatorId')?.enable();
          this.newActivityForm.get('evaluatorName')?.enable();
          this.newActivityForm.get('executiveReport')?.enable();
          this.newActivityForm.get('activityState')?.enable();
          break;
        case 'ASESORÍA':
          this.newActivityForm.get('nameActivity')?.enable();
          this.newActivityForm.get('administrativeAct')?.enable();
          this.newActivityForm.get('activity')?.enable();
          this.newActivityForm.get('weeklyHours')?.enable();
          this.newActivityForm.get('weeks')?.enable();
          this.newActivityForm.get('evaluatorId')?.enable();
          this.newActivityForm.get('evaluatorName')?.enable();
          this.newActivityForm.get('executiveReport')?.enable();
          this.newActivityForm.get('activityState')?.enable();
          break;
        //EXTENSIÓN
        case '7':
          this.newActivityForm.get('nameActivity')?.enable();
          this.newActivityForm.get('administrativeAct')?.enable();
          this.newActivityForm.get('projectName')?.enable();
          this.newActivityForm.get('weeklyHours')?.enable();
          this.newActivityForm.get('weeklyHours')?.enable();
          this.newActivityForm.get('evaluatorName')?.enable();
          this.newActivityForm.get('evaluatorId')?.enable();
          this.newActivityForm.get('executiveReport')?.enable();
          this.newActivityForm.get('activityState')?.enable();
          break;
        //OTROS SERVICIOS
        case '6':
          this.newActivityForm.get('nameActivity')?.enable();
          this.newActivityForm.get('administrativeAct')?.enable();
          this.newActivityForm.get('activity')?.enable();
          this.newActivityForm.get('weeklyHours')?.enable();
          this.newActivityForm.get('weeks')?.enable();
          this.newActivityForm.get('evaluatorId')?.enable();
          this.newActivityForm.get('evaluatorName')?.enable();
          this.newActivityForm.get('executiveReport')?.enable();
          this.newActivityForm.get('activityState')?.enable();
      }
    });
  }

  isDisabledField(field: string) {
    return this.newActivityForm.get(field)?.disabled;
  }

  isInvaldField(field: string) {
    const control = this.newActivityForm.get(field);
    return control && control.errors && control.invalid && (control.dirty || control.touched);
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

  // TODO: Implementar método para validar evaluador
  validateEvaluator(typeActivity: string): boolean {
    switch (typeActivity) {
      case 'DOCENCIA':
        if (this.userByIdResponse) {
          this.validateUserExist('USERDEPARTMENTBOSS','', '', 'JEFE DE DEPARTAMENTO', this.userByIdResponse.usuarioDetalle.departamento);
        }
        return false;
      case 'TRABAJOS DOCENCIA':
        this.listenerIdStudent();
        return true
      case 'PROYECTOS DE INVESTIGACIÓN':
        if (this.userByIdResponse) {
          this.validateUserExist('USERDEPARTMENTBOSS','', '', 'JEFE DE DEPARTAMENTO', this.userByIdResponse.usuarioDetalle.departamento);
        }
        return true;
      case 'TRABAJOS DE INVESTIGACIÓN':
        this.listenerIdStudent();
        return true;
      case 'ADMINISTRACIÓN':
        return true;
      case 'ASESORÍA':
        return true;
      case 'EXTENSION':
        return true;
      case 'OTROS SERVICIOS':
        return true;
    }
    return true;
  }

  onConfirm(event: any): void {
    if (event) {
      this.newActivityForm.markAllAsTouched();
      if (this.idUserParam && this.newActivityForm.valid) {
        const newActivity: NewActivity = {
          tipoActividad: {
            oidTipoActividad: Number(this.newActivityForm.get('typeActivity')?.value)
          },
          oidEvaluado: Number(this.idUserParam),
          oidEvaluador: Number(this.evaluator?.oidUsuario || 0),
          oidEstadoActividad: Number(this.newActivityForm.get('activityState')?.value),
          nombreActividad: this.newActivityForm.get('nameActivity')?.value,
          horas: Number(this.newActivityForm.get('weeklyHours')?.value),
          semanas: Number(this.newActivityForm.get('weeks')?.value),
          informeEjecutivo: this.newActivityForm.get('executiveReport')?.value,
          detalle: {
            codigo: this.newActivityForm.get('codeActivity')?.value,
            vri: this.newActivityForm.get('VRI')?.value,
            actoAdministrativo: this.newActivityForm.get('administrativeAct')?.value,
            nombreProyecto: this.newActivityForm.get('projectName')?.value,
            materia: this.newActivityForm.get('subject')?.value,
            actividad: this.newActivityForm.get('activity')?.value,
            grupo: this.newActivityForm.get('group')?.value
          },
        }
        this.activitiesManagementService.saveNewActivity(newActivity).subscribe(
          {
            next: (response) => {
              this.messagesInfoService.showSuccessMessage('Actividad guardada correctamente', 'Éxito');
              this.newActivityForm.reset();
              this.userResponseSeachById = null;
              this.userResponseSeachByName = null;
              this.userResponse = null;
              this.recoverActivitiesByUser();
            },
            error: (error) => {
              this.messagesInfoService.showErrorMessage('Error al guardar la actividad', 'Error');
            }
          }
        );
      } else {
        this.messagesInfoService.showWarningMessage('Por favor, verifica los campos', 'Advertencia');
      }
    }
  }

  clearFilterParams(): void {
    this.activitiesManagementService.setParamsActivitiesFilter({ nameActivity: '', typeActivity: '', activityCode: '', administrativeCode: '', vriCode: '' });

  }

  listenerIdStudent(): void {
    this.newActivityForm.get('idStudent')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe((value) => {
      if (value) {
        this.validateUserExist('USERSTUDENT',value, '', 'ESTUDIANTE', '');
      }
    });
  }

  // validateUserExist(idUser: string, userName: string, rol: string, departmen: string): User | null {
  //   if (idUser || rol || userName) {
  //     this.activitiesManagementService.getUserByParams(0, 3, idUser, userName, '', departmen, '', '', '', '', rol, 'ACTIVO').subscribe(
  //       {
  //         next: (response) => {
  //           if (idUser && !rol) {
  //             this.userResponseSeachById = response;
  //             return;
  //           } else {
  //             if (userName) {
  //               this.userResponseSeachByName = response;
  //               return;
  //             } else {
  //               if (idUser && rol) {
  //                 this.userResponse = response;
  //                 if (this.userResponse) {
  //                   this.evaluator = this.userResponse.content[0];
  //                   this.newActivityForm.get('evaluatorName')?.setValue(this.userResponse.content[0].nombres + ' ' + this.userResponse.content[0].apellidos);
  //                   this.newActivityForm.get('evaluatorId')?.setValue(this.userResponse.content[0].identificacion);
  //                 } else {
  //                   this.evaluator = null
  //                   this.newActivityForm.get('evaluatorName')?.setValue(null);
  //                   this.newActivityForm.get('evaluatorId')?.setValue(null);
  //                 }
  //                 return;
  //               }
  //             }
  //           }
  //         },
  //         error: (error) => {
  //           return null;
  //         }
  //       }
  //     );
  //   }
  //   return null;
  // }

  validateUserExist(typeValidation: string, idUser: string, userName: string, rol: string, department: string) {
    switch (typeValidation) {
      case 'USERSBYID':
        if (idUser) {
          this.activitiesManagementService.getUserByParams(0, 3, idUser, '', '', '', '', '', '', '', '', '1').subscribe(
            {
              next: (response) => {
                this.userResponseSeachById = response;
              },
              error: (error) => {
                this.userResponseSeachById = null;
              }
            }
          );
        }
        break;
      case 'USERSBYNAME':
        if (userName) {
          this.activitiesManagementService.getUserByParams(0, 3, '', userName, '', '', '', '', '', '', '', '1').subscribe(
            {
              next: (response) => {
                this.userResponseSeachByName = response;
              },
              error: (error) => {
                this.userResponseSeachByName = null;
              }
            }
          );
        }
        break;
      case 'USERSTUDENT':
        if (idUser) {
          this.activitiesManagementService.getUserByParams(0, 3, idUser, '', '', '', '', '', '', '', '2', '1').subscribe(
            {
              next: (response) => {
                this.userResponse = response;
                if (this.userResponse) {
                  this.evaluator = this.userResponse.content[0];
                  this.newActivityForm.get('evaluatorName')?.setValue(this.userResponse.content[0].nombres + ' ' + this.userResponse.content[0].apellidos);
                  this.newActivityForm.get('evaluatorId')?.setValue(this.userResponse.content[0].identificacion);
                } else {
                  this.evaluator = null
                  this.newActivityForm.get('evaluatorName')?.setValue(null);
                  this.newActivityForm.get('evaluatorId')?.setValue(null);
                }
              },
              error: (error) => {
                this.userResponse = null;
              }
            }
          );
        }
        break;
      case 'USERDEPARTMENTBOSS':
        if (rol && department) {
          this.activitiesManagementService.getUserByParams(0, 3, '', '', '', department, '', '', '', '', rol, '1').subscribe(
            {
              next: (response) => {
                this.userResponse = response;
                if (this.userResponse) {
                  this.evaluator = this.userResponse.content[0];
                  this.newActivityForm.get('evaluatorName')?.setValue(this.userResponse.content[0].nombres + ' ' + this.userResponse.content[0].apellidos);
                  this.newActivityForm.get('evaluatorId')?.setValue(this.userResponse.content[0].identificacion);
                } else {
                  this.evaluator = null
                  this.newActivityForm.get('evaluatorName')?.setValue(null);
                  this.newActivityForm.get('evaluatorId')?.setValue(null);
                }
              },
              error: (error) => {
                this.userResponse = null;
              }
            }
          );
          break;
        }
    }

  }

  selectUser(user: User | null): void {
    if (user) {
      this.evaluator = user;
      this.newActivityForm.get('evaluatorName')?.setValue(user?.nombres + ' ' + user?.apellidos);
      this.newActivityForm.get('evaluatorId')?.setValue(user?.identificacion);
    }
  }

  openConfirmDialog(): void {
    this.confirmDialogComponent?.open();
  }


  recoverActivitiesByUser() {
    if (this.idUserParam) {
      this.activitiesManagementService.setParamsActivitiesFilter({ nameActivity: '', typeActivity: '', activityCode: '', administrativeCode: '', vriCode: '' });
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
    }, 100)
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
    }, 100)
  }


  onChangeInfoEvaluator() {
    this.newActivityForm.get('evaluatorId')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe((value) => {
      this.typeResulsSearchId = value;
      if (value) {
        this.validateUserExist('USERSBYID',value, '', '', '');
      } else {
        this.userResponseSeachById = null;
      }
    });


    this.newActivityForm.get('evaluatorName')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe((value) => {
      this.typeResulsSearchName = value;
      if (value) {
        this.validateUserExist('USERSBYNAME','', value, '', '');
      } else {
        this.userResponseSeachByName = null;
      }
    });

  }





}
