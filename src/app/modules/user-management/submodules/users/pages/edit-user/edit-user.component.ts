import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import { UsersServiceService } from '../../services/users-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NewUser, User } from '../../../../../../core/models/users.interfaces';
import { CommonModule } from '@angular/common';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { ConfirmDialogComponent } from '../../../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConfirmDialogComponent
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {

  @ViewChild(ConfirmDialogComponent) confirmDialog: ConfirmDialogComponent | null = null;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private messageToast = inject(MessagesInfoService);
  private validatorsService = inject(ValidatorsService);
  private UserServices = inject(UsersServiceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogDataService = inject(CatalogDataService);

  public idUserParam: number | null = null;
  public userInformation: User | null = null;
  public catalogData: CatalogDataResponse | null = null;

  public messageConfirmDialog: string = '¿Está seguro de actualizar el usuario?';
  public titleConfirmDialog: string = 'Confirmar actualización de usuario';

  editUserForm: FormGroup = this.formBuilder.group({
    role: this.formBuilder.array([], [Validators.required]),
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
    this.idUserParam = this.route.snapshot.params['id']
    this.recoverCatalogData();
    this.disableField();
    this.changesInRoleField();
    this.recoverData();
  }

  /*
  * Method to recover the data of the user
  * */
  recoverData(): void {
    if (this.idUserParam) {
      this.UserServices.getUserbyId(this.idUserParam).subscribe(
        {
          next: (response) => {
            this.userInformation = response;
            response.roles.forEach((role) => {
              this.rolesFormArray.push(this.formBuilder.control(role.oid));
            });
            this.setValuesForm(response);
            this.changesInRoleField();
          },
          error: (error) => {
            this.messageToast.showErrorMessage('Error al recuperar la información del usuario', 'Error');
          }
        }
      )
    }
  }

  /*
  * Method to recover the catalog data
  * */
  recoverCatalogData(): void {
    this.catalogData = this.catalogDataService.catalogDataSignal;
  }

  /*
  * Method to get the roles form array
  * */
  get rolesFormArray() {
    return this.editUserForm.get('role') as FormArray;
  }

  /*
  * Method to set the values of the form
  * @param userInfoResponse:User
  * */
  setValuesForm(userInfoResponse: User): void {
    this.editUserForm.get('name')?.setValue(userInfoResponse.nombres);
    this.editUserForm.get('lastName')?.setValue(userInfoResponse.apellidos);
    this.editUserForm.get('email')?.setValue(userInfoResponse.correo);
    this.editUserForm.get('idUser')?.setValue(userInfoResponse.identificacion);
    this.editUserForm.get('faculty')?.setValue(userInfoResponse.usuarioDetalle.facultad);
    this.editUserForm.get('program')?.setValue(userInfoResponse.usuarioDetalle.departamento);
    this.editUserForm.get('typeContract')?.setValue(userInfoResponse.usuarioDetalle.contratacion);
    this.editUserForm.get('studies')?.setValue(userInfoResponse.usuarioDetalle.estudios);
    this.editUserForm.get('category')?.setValue(userInfoResponse.usuarioDetalle.categoria);
    this.editUserForm.get('dedication')?.setValue(userInfoResponse.usuarioDetalle.dedicacion);
    this.editUserForm.get('state')?.setValue(userInfoResponse.estadoUsuario.oidEstadoUsuario);
  }

  /*	
  * Method to check if a role is checked
  * @param roleId:string
  * @returns boolean
  * */
  isChekedRol(roleId: string): boolean {
    const id = parseFloat(roleId);
    return this.userInformation?.roles.some((role) => role.oid === id) || false;
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
      this.setValuesForm(this.userInformation || {} as User);
    } else {
      const index = this.rolesFormArray.controls.findIndex(
        (control) => control.value.toString() === event.target.value
      );

      this.rolesFormArray.removeAt(index);
      this.changesInRoleField();
    }
  }

  /*
  * Method to enable or disable the fields depending on the role
  * */
  changesInRoleField() {
    for (const role of this.editUserForm.get('role')?.value) {
      const rolString = role.toString();
      switch (rolString) {
        case '1':
          this.editUserForm.get('name')?.enable();
          this.editUserForm.get('lastName')?.enable();
          this.editUserForm.get('email')?.enable();
          this.editUserForm.get('idUser')?.enable();
          this.editUserForm.get('faculty')?.enable();
          this.editUserForm.get('program')?.enable();
          this.editUserForm.get('typeContract')?.enable();
          this.editUserForm.get('studies')?.enable();
          this.editUserForm.get('category')?.enable();
          this.editUserForm.get('dedication')?.enable();
          this.editUserForm.get('state')?.enable();
          break;
        case '2':
          this.editUserForm.get('name')?.enable();
          this.editUserForm.get('lastName')?.enable();
          this.editUserForm.get('email')?.enable();
          this.editUserForm.get('idUser')?.enable();
          this.editUserForm.get('faculty')?.enable();
          this.editUserForm.get('program')?.enable();
          this.editUserForm.get('state')?.enable();
          break;
        case '3':
          this.editUserForm.get('name')?.enable();
          this.editUserForm.get('lastName')?.enable();
          this.editUserForm.get('email')?.enable();
          this.editUserForm.get('idUser')?.enable();
          this.editUserForm.get('faculty')?.enable();
          this.editUserForm.get('state')?.enable();
          break;
        case '4':
          this.editUserForm.get('name')?.enable();
          this.editUserForm.get('lastName')?.enable();
          this.editUserForm.get('email')?.enable();
          this.editUserForm.get('idUser')?.enable();
          this.editUserForm.get('faculty')?.enable();
          this.editUserForm.get('program')?.enable();
          this.editUserForm.get('state')?.enable();
          break;
        default:
          break;
      }
    }
    this.clearDiseabledFields();
  }

  /*
  * Method to check if a field is disabled
  * @param field:string
  * @returns boolean
  *  */
  isDisabledField(field: string) {
    return this.editUserForm.get(field)?.disabled;
  }

  /*
  * Method to check if a field is invalid
  * @param field:string
  * @returns boolean
  * */
  isInvaldField(field: string) {
    const control = this.editUserForm.get(field);
    return control && control.errors && control.invalid && (control.dirty || control.touched);
  }


  /*
  * Method to get the error of a field
  * @param field:string
  * @returns string | null
  * */
  getFieldError(field: string): string | null {
    if (!this.editUserForm.controls[field]) return null;
    const control = this.editUserForm.controls[field];
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
* Method to validate if the role field is invalid
* */
  isInvalidRoleField() {
    const control = this.editUserForm.get('role');
    if (control?.value.length === 0) {
      return true;
    }
    return false;
  }


  /*
  * Method to disable the fields
  * */
  disableField() {
    this.editUserForm.get('name')?.disable();
    this.editUserForm.get('lastName')?.disable();
    this.editUserForm.get('email')?.disable();
    this.editUserForm.get('idUser')?.disable();
    this.editUserForm.get('faculty')?.disable();
    this.editUserForm.get('program')?.disable();
    this.editUserForm.get('typeContract')?.disable();
    this.editUserForm.get('studies')?.disable();
    this.editUserForm.get('category')?.disable();
    this.editUserForm.get('dedication')?.disable();
    this.editUserForm.get('state')?.disable();
  }

  /*
  * Method to  update the user information
  * */
  onConfirm(event: boolean | void) {
    if (!event) return;
    this.editUserForm.markAllAsTouched();
    if (this.editUserForm.valid) {
      let userUpdate: NewUser = {
        nombres: this.editUserForm.get('name')?.value,
        apellidos: this.editUserForm.get('lastName')?.value,
        correo: this.editUserForm.get('email')?.value,
        username: '',
        identificacion: this.editUserForm.get('idUser')?.value,
        estadoUsuario: {
          oidEstadoUsuario: this.editUserForm.get('state')?.value,
        },
        usuarioDetalle: {
          facultad: this.editUserForm.get('faculty')?.value,
          departamento: this.editUserForm.get('program')?.value,
          categoria: this.editUserForm.get('category')?.value,
          contratacion: this.editUserForm.get('typeContract')?.value,
          dedicacion: this.editUserForm.get('dedication')?.value,
          estudios: this.editUserForm.get('studies')?.value,
        },
        roles: this.editUserForm.get('role')?.value.map((role: string) => {
          return {
            oid: role
          }
        })
      };
      if (this.userInformation) {
        this.UserServices.updateUsers(this.userInformation.oidUsuario, userUpdate).subscribe({
          next: (response) => {
            this.messageToast.showSuccessMessage('Usuario actualizado correctamente', 'Actualización exitosa');
            this.clearFormFields();
            this.router.navigate(['/app/gestion-usuarios/usuarios']);
          },
          error: (error) => {
            this.messageToast.showErrorMessage('Error al actualizar el usuario', 'Error');
          }
        })
      }
    } else {
      this.messageToast.showWarningMessage('Por favor, verifica los campos', 'Advertencia');
    }
  }

  /*
  * Method to clear the disabled fields
  * */
  clearDiseabledFields() {
    this.editUserForm.get('name')?.status === 'DISABLED' ? this.editUserForm.get('name')?.reset() : null;
    this.editUserForm.get('lastName')?.status === 'DISABLED' ? this.editUserForm.get('lastName')?.reset() : null;
    this.editUserForm.get('email')?.status === 'DISABLED' ? this.editUserForm.get('email')?.reset() : null;
    this.editUserForm.get('idUser')?.status === 'DISABLED' ? this.editUserForm.get('idUser')?.reset() : null;
    this.editUserForm.get('faculty')?.status === 'DISABLED' ? this.editUserForm.get('faculty')?.reset() : null;
    this.editUserForm.get('program')?.status === 'DISABLED' ? this.editUserForm.get('program')?.reset() : null;
    this.editUserForm.get('typeContract')?.status === 'DISABLED' ? this.editUserForm.get('typeContract')?.reset() : null;
    this.editUserForm.get('studies')?.status === 'DISABLED' ? this.editUserForm.get('studies')?.reset() : null;
    this.editUserForm.get('category')?.status === 'DISABLED' ? this.editUserForm.get('category')?.reset() : null;
    this.editUserForm.get('dedication')?.status === 'DISABLED' ? this.editUserForm.get('dedication')?.reset() : null;
    this.editUserForm.get('state')?.status === 'DISABLED' ? this.editUserForm.get('state')?.reset() : null;
  }


  /*
  * Method to open the confirm dialog
  * */
  openConfirmDialog() {
    if (this.confirmDialog) this.confirmDialog.open();
  }

  /*
  * Method to clear the fields
  * */
  clearFormFields() {
    this.editUserForm.reset();
  }


  /*
  * Method to go back
  * */
  goBack() {
    this.router.navigate(['/app/gestion-usuarios/usuarios']);
  }
}
