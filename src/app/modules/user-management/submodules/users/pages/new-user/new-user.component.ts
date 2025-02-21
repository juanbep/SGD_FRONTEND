import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UsersServiceService } from '../../services/users-service.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import { NewUser } from '../../../../../../core/models/users.interfaces';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';

@Component({
  selector: 'user-management-new-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ConfirmDialogComponent
  ],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css'
})
export class NewUserComponent implements OnInit {

  @ViewChild(ConfirmDialogComponent) confirmDialog!: ConfirmDialogComponent;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private messageToast = inject(MessagesInfoService);
  private userServices = inject(UsersServiceService);
  private validatorsService = inject(ValidatorsService);
  private catalogDataService = inject(CatalogDataService);

  public messageConfirmDialog: string = '¿Está seguro de crear el usuario?';
  public titleConfirmDialog: string = 'Confirmar creación de usuario';
  public catalogDataResponse: CatalogDataResponse | null = null;



  newUserForm: FormGroup = this.formBuilder.group({
    role: this.formBuilder.array([], [Validators.required, this.validatorsService.minSelectedCheckboxes]),
    name: [null, Validators.required],
    lastName: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    idUser: [null, [Validators.required, Validators.pattern(this.validatorsService.numericPattern)]],
    faculty: [null, Validators.required],
    program: [null, Validators.required],
    typeContract: [null, Validators.required],
    studies: [null, Validators.required],
    category: [null, Validators.required],
    dedication: [null, Validators.required],
    state: [null, Validators.required],
  });

  stateOptions = [
    {
      value: '1',
      text: 'Activo'
    },
    {
      value: '2',
      text: 'Inactivo'
    }
  ]


  ngOnInit(): void {
    this.disableField();
    this.catalogDataResponse = this.catalogDataService.catalogDataSignal;
  }


  /*
  * Method to get the form array of roles
  */
  get rolesFormArray() {
    return this.newUserForm.get('role') as FormArray;
  }

  /*
  * Method to handle the change of the checkbox
  * @param event:any
  * */
  onCheckboxChange(event: any) {
    const rolsFormArray = this.rolesFormArray;
    this.disableField();
    if (event.target.checked) {
      rolsFormArray.push(this.formBuilder.control(event.target.value));
      this.changesInRoleField();
    } else {
      const index = this.rolesFormArray.controls.findIndex(
        (control) => control.value === event.target.value
      );
      this.rolesFormArray.removeAt(index);
      this.changesInRoleField();
    }
  }

  /*
  * Method to disable the fields
  */
  disableField() {
    this.newUserForm.get('name')?.disable();
    this.newUserForm.get('lastName')?.disable();
    this.newUserForm.get('email')?.disable();
    this.newUserForm.get('idUser')?.disable();
    this.newUserForm.get('faculty')?.disable();
    this.newUserForm.get('program')?.disable();
    this.newUserForm.get('typeContract')?.disable();
    this.newUserForm.get('studies')?.disable();
    this.newUserForm.get('category')?.disable();
    this.newUserForm.get('dedication')?.disable();
    this.newUserForm.get('state')?.disable();
  }

  /*
  * Method to validate the fields
  * @param field:string
  * */
  isDisabledField(field: string) {
    return this.newUserForm.get(field)?.disabled;
  }

  /*
  * Method to validate the fields
  * @param field:string
  * */
  isInvaldField(field: string) {
    const control = this.newUserForm.get(field);
    return control && control.errors && control.invalid && (control.dirty || control.touched);
  }

  /*
  * Method to enable or disable the fields depending on the role
  * */
  changesInRoleField() {
    for (const role of this.newUserForm.get('role')?.value) {
      switch (role) {
        //Docente
        case '1':
          this.newUserForm.get('name')?.enable();
          this.newUserForm.get('lastName')?.enable();
          this.newUserForm.get('email')?.enable();
          this.newUserForm.get('idUser')?.enable();
          this.newUserForm.get('faculty')?.enable();
          this.newUserForm.get('program')?.enable();
          this.newUserForm.get('typeContract')?.enable();
          this.newUserForm.get('studies')?.enable();
          this.newUserForm.get('category')?.enable();
          this.newUserForm.get('dedication')?.enable();
          this.newUserForm.get('state')?.enable();
          break;
        //Estudiante
        case '2':
          this.newUserForm.get('name')?.enable();
          this.newUserForm.get('lastName')?.enable();
          this.newUserForm.get('email')?.enable();
          this.newUserForm.get('idUser')?.enable();
          this.newUserForm.get('faculty')?.enable();
          this.newUserForm.get('program')?.enable();
          this.newUserForm.get('state')?.enable();
          break;
        //Decano
        case '3':
          this.newUserForm.get('name')?.enable();
          this.newUserForm.get('lastName')?.enable();
          this.newUserForm.get('email')?.enable();
          this.newUserForm.get('idUser')?.enable();
          this.newUserForm.get('faculty')?.enable();
          this.newUserForm.get('state')?.enable();
          break;
        //Jefe de departamento
        case '4':
          this.newUserForm.get('name')?.enable();
          this.newUserForm.get('lastName')?.enable();
          this.newUserForm.get('email')?.enable();
          this.newUserForm.get('idUser')?.enable();
          this.newUserForm.get('faculty')?.enable();
          this.newUserForm.get('program')?.enable();
          this.newUserForm.get('state')?.enable();
          break;
        //Secretaria/o facultad
        case '5':
          this.newUserForm.get('name')?.enable();
          this.newUserForm.get('lastName')?.enable();
          this.newUserForm.get('email')?.enable();
          this.newUserForm.get('idUser')?.enable();
          this.newUserForm.get('faculty')?.enable();
          this.newUserForm.get('state')?.enable();
          break;
        //Coordianador
        case '52':
          this.newUserForm.get('name')?.enable();
          this.newUserForm.get('lastName')?.enable();
          this.newUserForm.get('email')?.enable();
          this.newUserForm.get('idUser')?.enable();
          this.newUserForm.get('faculty')?.enable();
          this.newUserForm.get('program')?.enable();
          this.newUserForm.get('state')?.enable();
          break;
        
        //CPD
        case '53':
          this.newUserForm.get('name')?.enable();
          this.newUserForm.get('lastName')?.enable();
          this.newUserForm.get('email')?.enable();
          this.newUserForm.get('idUser')?.enable();
          this.newUserForm.get('faculty')?.enable();
          this.newUserForm.get('state')?.enable();
          break;
        default:
          break;
      }
    }
    this.clearDiseabledFields();
  }

  /*
  * Method to get the field error
  * @param field:string
  * */
  getFieldError(field: string): string | null {
    if (!this.newUserForm.controls[field]) return null;
    const control = this.newUserForm.controls[field];
    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'email':
          return 'El email no es válido';
        case 'pattern':
          return 'El campo solo acepta números';
        default:
          return null;
      }
    }
    return null;
  }

  /*
  * Method to handle the confirm event and save the user
  * @param event:boolean|void
  * */
  onConfirm(event: boolean | void): void {
    if (event) {
      this.newUserForm.markAllAsTouched();
      if (this.newUserForm.valid) {
        let newUser: NewUser[] = [{
          nombres: this.newUserForm.get('name')?.value,
          apellidos: this.newUserForm.get('lastName')?.value,
          correo: this.newUserForm.get('email')?.value,
          username: '',
          identificacion: this.newUserForm.get('idUser')?.value,
          estadoUsuario: {
            oidEstadoUsuario: this.newUserForm.get('state')?.value.toString(),
          },
          usuarioDetalle: {
            facultad: this.newUserForm.get('faculty')?.value,
            departamento: this.newUserForm.get('program')?.value,
            categoria: this.newUserForm.get('category')?.value,
            contratacion: this.newUserForm.get('typeContract')?.value,
            dedicacion: this.newUserForm.get('dedication')?.value,
            estudios: this.newUserForm.get('studies')?.value,
          },
          roles: this.newUserForm.get('role')?.value.map((role: string) => {
            return {
              oid: role
            }
          })
        }];
        this.userServices.saveUser(newUser).subscribe(
          {
            next: () => {
              this.messageToast.showSuccessMessage('Usuario creado correctamente', 'Usuario creado');
              this.clearFormFields();
            },
            error: () => {
              this.messageToast.showErrorMessage('Error al crear el usuario', 'Error');
            }
          }
        );
      } else {
        this.messageToast.showWarningMessage('Por favor, verifica los campos', 'Advertencia');
      }
    }
  }
  /*
  * Method to validate if the role field is invalid
  * */
  isInvalidRoleField() {
    const control = this.newUserForm.get('role');
    if (control?.value.length === 0) {
      return true;
    }
    return false;
  }


  /*
  * Method to go back
  * */
  goBack() {
    window.history.back();
  }

  /*
  * Method to clear the fields that are disabled
  * */
  clearDiseabledFields() {
    //Limpia los campos que estan deshabilitados

    this.newUserForm.get('name')?.status === 'DISABLED' ? this.newUserForm.get('name')?.reset() : null;
    this.newUserForm.get('lastName')?.status === 'DISABLED' ? this.newUserForm.get('lastName')?.reset() : null;
    this.newUserForm.get('email')?.status === 'DISABLED' ? this.newUserForm.get('email')?.reset() : null;
    this.newUserForm.get('idUser')?.status === 'DISABLED' ? this.newUserForm.get('idUser')?.reset() : null;
    this.newUserForm.get('faculty')?.status === 'DISABLED' ? this.newUserForm.get('faculty')?.reset() : null;
    this.newUserForm.get('program')?.status === 'DISABLED' ? this.newUserForm.get('program')?.reset() : null;
    this.newUserForm.get('typeContract')?.status === 'DISABLED' ? this.newUserForm.get('typeContract')?.reset() : null;
    this.newUserForm.get('studies')?.status === 'DISABLED' ? this.newUserForm.get('studies')?.reset() : null;
    this.newUserForm.get('category')?.status === 'DISABLED' ? this.newUserForm.get('category')?.reset() : null;
    this.newUserForm.get('dedication')?.status === 'DISABLED' ? this.newUserForm.get('dedication')?.reset() : null;
    this.newUserForm.get('state')?.status === 'DISABLED' ? this.newUserForm.get('state')?.reset() : null;

  }

  /*
  * Method to clear the fields
  * */
  clearFormFields() {
    window.location.reload();
  }


  /*
  * Method to open the confirm dialog
  * */
  openConfirmDialog() {
    this.confirmDialog.open();
  }



}
