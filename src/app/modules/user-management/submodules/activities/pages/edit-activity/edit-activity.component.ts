import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-edit-activity',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ConfirmDialogComponent
  ],
  templateUrl: './edit-activity.component.html',
  styleUrl: './edit-activity.component.css'
})
export class EditActivityComponent implements OnInit {

  @ViewChild(ConfirmDialogComponent) confirmDialogComponent: ConfirmDialogComponent | null = null;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private activatedRoute = inject(ActivatedRoute);
  private activitiesManagementService = inject(ActivitiesManagementService);
  private messagesInfoService = inject(MessagesInfoService);
  private catalogDataService = inject(CatalogDataService);



  public idUserParam: number | null = null;
  public activity: ActividadResponse | null = null;
  public catalogResponse: CatalogDataResponse | null = null;
  public evaluator: UsuarioResponse | null = null;



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
    this.recoverInfoActivity();
    this.onChangeInfoEvaluator();

  }

  recoverInfoActivity() {
    this.enableFields();
    if (this.idUserParam) {
      this.activitiesManagementService.getActivityById(this.idUserParam).subscribe(
        {
          next: (response) => {
            this.activity = response;
            this.setDefaultValues();
          },
          error: (error) => {
            this.messagesInfoService.showErrorMessage('No se pudo recuperar la información de la actividad', 'Error');
          }
        }
      )
    }
  }

  recoverCatalogData(): void {
    this.catalogResponse = this.catalogDataService.catalogDataSignal;
  }

  setDefaultValues() {
    if (this.activity) {
      this.activityForm.get('typeActivity')?.setValue(this.activity.tipoActividad.oidTipoActividad);
      this.activityForm.get('nameActivity')?.setValue(this.activity.nombreActividad);
      for(let atributo of this.activity.atributos){
        if(atributo.codigoAtributo === 'CODIGO'){
          this.activityForm.get('codeActivity')?.setValue(atributo.valor);
        }
        if(atributo.codigoAtributo === 'ACTO_ADMINISTRATIVO'){
          this.activityForm.get('administrativeAct')?.setValue(atributo.valor);
        }
        if(atributo.codigoAtributo === 'VRI'){
          this.activityForm.get('VRI')?.setValue(atributo.valor);
        }
        if(atributo.codigoAtributo === 'ACTIVIDAD'){
          this.activityForm.get('activity')?.setValue(atributo.valor);
        }
        if(atributo.codigoAtributo === 'GRUPO'){
          this.activityForm.get('group')?.setValue(atributo.valor);
        }
        if(atributo.codigoAtributo === 'MATERIA'){
          this.activityForm.get('subject')?.setValue(atributo.valor);
        }
        if(atributo.codigoAtributo === 'NOMBRE_PROYECTO'){
          this.activityForm.get('projectName')?.setValue(atributo.valor);
        }
        
      }
      this.activityForm.get('weeklyHours')?.setValue(this.activity.horas.toString());
      this.activityForm.get('weeks')?.setValue(this.activity.semanas.toString());
      if (this.activity.tipoActividad.oidTipoActividad === 2 || this.activity.tipoActividad.oidTipoActividad === 8) {
        this.activityForm.get('idStudent')?.setValue(this.activity.evaluador.identificacion);
      }
      this.activityForm.get('evaluatorName')?.setValue(this.activity.evaluador);
      this.activityForm.get('executiveReport')?.setValue(this.activity.informeEjecutivo ? 'TRUE' : 'FALSE');
      this.activityForm.get('activityState')?.setValue(this.activity.oidEstadoActividad);
      this.activityForm.get('evaluatorId')?.setValue(this.activity.evaluador.identificacion);
      this.activityForm.get('evaluatorName')?.setValue(this.activity.evaluador.nombres + ' ' + this.activity.evaluador.apellidos);
    }

  }

  enableFields(): void {
    this.activityForm.get('typeActivity')?.valueChanges.subscribe((value) => {
      this.disableFields();
      value = value.toString();
      switch (value) {
        //DOCENCIA
        case '1':
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
          this.validateEvaluator('DOCENCIA');
          break;
        //TRABAJOS DOCENCIA
        case '2':
          this.activityForm.get('nameActivity')?.enable();
          this.activityForm.get('administrativeAct')?.enable();
          this.activityForm.get('idStudent')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('weeks')?.enable();
          this.activityForm.get('evaluatorName')?.enable();
          this.activityForm.get('evaluatorId')?.enable();
          this.activityForm.get('executiveReport')?.enable();
          this.activityForm.get('activityState')?.enable();
          this.validateEvaluator('TRABAJOS DOCENCIA');
          break;
        //PROYECTOS DE INVESTIGACIÓN
        case '3':
          this.activityForm.get('nameActivity')?.enable();
          this.activityForm.get('VRI')?.enable();
          this.activityForm.get('projectName')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('weeks')?.enable();
          this.activityForm.get('evaluatorName')?.enable();
          this.activityForm.get('evaluatorId')?.enable();
          this.activityForm.get('executiveReport')?.enable();
          this.activityForm.get('activityState')?.enable();
          this.validateEvaluator('PROYECTOS DE INVESTIGACIÓN');

          break;

        //TRABAJOS DE INVESTIGACIÓN
        case '8':
          this.activityForm.get('nameActivity')?.enable();
          this.activityForm.get('administrativeAct')?.enable();
          this.activityForm.get('idStudent')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('weeks')?.enable();
          this.activityForm.get('evaluatorId')?.enable();
          this.activityForm.get('evaluatorName')?.enable();
          this.activityForm.get('executiveReport')?.enable();
          this.activityForm.get('activityState')?.enable();
          this.validateEvaluator('TRABAJOS DE INVESTIGACIÓN');
          break;
        //ADMINISTRACIÓN
        case '5':
          this.activityForm.get('nameActivity')?.enable();
          this.activityForm.get('administrativeAct')?.enable();
          this.activityForm.get('activity')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('weeks')?.enable();
          this.activityForm.get('evaluatorId')?.enable();
          this.activityForm.get('evaluatorName')?.enable();
          this.activityForm.get('executiveReport')?.enable();
          this.activityForm.get('activityState')?.enable();
          break;
        case 'ASESORÍA':
          this.activityForm.get('nameActivity')?.enable();
          this.activityForm.get('administrativeAct')?.enable();
          this.activityForm.get('activity')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('weeks')?.enable();
          this.activityForm.get('evaluatorId')?.enable();
          this.activityForm.get('evaluatorName')?.enable();
          this.activityForm.get('executiveReport')?.enable();
          this.activityForm.get('activityState')?.enable();
          break;
        //EXTENSIÓN
        case '7':
          this.activityForm.get('nameActivity')?.enable();
          this.activityForm.get('administrativeAct')?.enable();
          this.activityForm.get('projectName')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('evaluatorName')?.enable();
          this.activityForm.get('evaluatorId')?.enable();
          this.activityForm.get('executiveReport')?.enable();
          this.activityForm.get('activityState')?.enable();
          break;
        //OTROS SERVICIOS
        case '6':
          this.activityForm.get('nameActivity')?.enable();
          this.activityForm.get('administrativeAct')?.enable();
          this.activityForm.get('activity')?.enable();
          this.activityForm.get('weeklyHours')?.enable();
          this.activityForm.get('weeks')?.enable();
          this.activityForm.get('evaluatorId')?.enable();
          this.activityForm.get('evaluatorName')?.enable();
          this.activityForm.get('executiveReport')?.enable();
          this.activityForm.get('activityState')?.enable();
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
    return control && control.errors && control.invalid && (control.dirty || control.touched);
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


  validateEvaluator(typeActivity: string): boolean {
    switch (typeActivity) {
      case 'DOCENCIA':
        this.validateUserExist('', '', '4');
        return false;
      case 'TRABAJOS DOCENCIA':
        this.listenerIdStudent();
        return true
      case 'PROYECTOS DE INVESTIGACIÓN':
        this.validateUserExist('', '', '4');
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

  validateUserExist(idUser: string, userName: string, rol: string): UsuarioResponse | null {
    if (idUser || rol || userName) {
      this.activitiesManagementService.getUserByParams(0, 3, idUser, userName, '', '', '', '', '', '', rol, '1').subscribe(
        {
          next: (response) => {
            if (idUser && !rol) {
              this.userResponseSeachById = response.data;
              return;
            } else {
              if (userName) {
                this.userResponseSeachByName = response.data;
                return;
              } else {
                if (idUser && rol) {
                  this.userResponse = response.data;
                  if (this.userResponse) {
                    this.evaluator = this.userResponse.content[0];
                    this.activityForm.get('evaluatorName')?.setValue(this.userResponse.content[0].nombres + ' ' + this.userResponse.content[0].apellidos);
                    this.activityForm.get('evaluatorId')?.setValue(this.userResponse.content[0].identificacion);
                  } else {
                    this.evaluator = null
                    this.activityForm.get('evaluatorName')?.setValue(null);
                    this.activityForm.get('evaluatorId')?.setValue(null);
                  }
                  return;
                }
              }
            }
          },
          error: (error) => {
            return null;
          }
        });
    }
    return null;
  }

  listenerIdStudent(): void {
    this.activityForm.get('idStudent')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe((value) => {
      if (value) {
        this.validateUserExist(value, '', '2');
      }
    });
  }


  selectUser(user: UsuarioResponse | null): void {
    if (user) {
      this.evaluator = user;
      this.activityForm.get('evaluatorName')?.setValue(user?.nombres + ' ' + user?.apellidos);
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
    }, 100)
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
    }, 100)
  }

  onChangeInfoEvaluator() {
    this.activityForm.get('evaluatorId')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe((value) => {
      this.typeResulsSearchId = value;
      if (value) {
        this.validateUserExist(value, '', '');
      } else {
        this.userResponseSeachById = null;
      }
    });


    this.activityForm.get('evaluatorName')?.valueChanges.pipe(
      debounceTime(500)
    ).subscribe((value) => {
      this.typeResulsSearchName = value;
      if (value) {
        this.validateUserExist('', value, '');
      } else {
        this.userResponseSeachByName = null;
      }
    });
  }

  onConfirm(event: any): void {
    if (event) {
      this.activityForm.markAllAsTouched();
      if (this.idUserParam && this.activityForm.valid) {
        const newActivity: ActividadCreate = {
          tipoActividad: {
            oidTipoActividad: Number(this.activityForm.get('typeActivity')?.value)
          },
          oidEvaluado: Number(this.idUserParam),
          oidEvaluador: Number(this.evaluator?.oidUsuario || 0),
          oidEstadoActividad: Number(this.activityForm.get('activityState')?.value),
          nombreActividad: this.activityForm.get('nameActivity')?.value,
          horas: Number(this.activityForm.get('weeklyHours')?.value),
          semanas: Number(this.activityForm.get('weeks')?.value),
          informeEjecutivo: this.activityForm.get('executiveReport')?.value,
          atributos: [
            { codigoAtributo: 'CODIGO', valor: this.activityForm.get('codeActivity')?.value },
            { codigoAtributo: 'ACTO_ADMINISTRATIVO', valor: this.activityForm.get('administrativeAct')?.value },
            { codigoAtributo: 'VRI', valor: this.activityForm.get('VRI')?.value },
            { codigoAtributo: 'ACTIVIDAD', valor: this.activityForm.get('activity')?.value },
            { codigoAtributo: 'GRUPO', valor: this.activityForm.get('group')?.value },
            { codigoAtributo: 'MATERIA', valor: this.activityForm.get('subject')?.value },
            { codigoAtributo: 'NOMBRE_PROYECTO', valor: this.activityForm.get('projectName')?.value }
          ]
          
        }
        this.activitiesManagementService.updateActivity(this.idUserParam, newActivity).subscribe(
          {
            next: (response) => {
              this.messagesInfoService.showSuccessMessage('Actividad editada correctamente', 'Éxito');
              this.activityForm.reset();
              this.userResponseSeachById = null;
              this.userResponseSeachByName = null;
              this.userResponse = null;
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


  openConfirmDialog(): void {
    this.confirmDialogComponent?.open();
  }

  goBack(): void {
    window.history.back();
  }
}
