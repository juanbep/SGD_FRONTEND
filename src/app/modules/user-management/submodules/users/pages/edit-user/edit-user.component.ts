import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import { UsersServiceService } from '../../services/users-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NewUser, User } from '../../../../../../core/models/users.interfaces';
import { CommonModule } from '@angular/common';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {
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

  editUserForm: FormGroup = this.formBuilder.group({
    role: [null, Validators.required],
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
      value: '0',
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

  recoverData(): void {
    if (this.idUserParam) {
      this.UserServices.getUserbyId(this.idUserParam).subscribe(
        {
          next: (response) => {
            this.userInformation = response;
            
            this.setValuesForm(response);
          },
          error: (error) => {
            this.messageToast.showErrorMessage('Error al recuperar la información del usuario', 'Error');
          }
        }
      )
    }
  }

  recoverCatalogData(): void {
    this.catalogDataService.getCatalogData().subscribe( (response) => {
      this.catalogData = response;
    });
  }

  setValuesForm(userInfoResponse: User): void {
    this.editUserForm.get('role')?.setValue(userInfoResponse.roles[0].nombre);
    this.disableFieldByRole(userInfoResponse.roles[0].nombre);
    console.log(userInfoResponse.roles[0].nombre);
    this.editUserForm.get('name')?.setValue(userInfoResponse.nombres);
    this.editUserForm.get('lastName')?.setValue(userInfoResponse.apellidos);
    this.editUserForm.get('email')?.setValue(userInfoResponse.correo);
    this.editUserForm.get('idUser')?.setValue(userInfoResponse.usuarioDetalle.identificacion);
    this.editUserForm.get('faculty')?.setValue(userInfoResponse.usuarioDetalle.facultad);
    this.editUserForm.get('program')?.setValue(userInfoResponse.usuarioDetalle.departamento);
    this.editUserForm.get('typeContract')?.setValue(userInfoResponse.usuarioDetalle.contratacion);
    this.editUserForm.get('studies')?.setValue(userInfoResponse.usuarioDetalle.estudios);
    this.editUserForm.get('category')?.setValue(userInfoResponse.usuarioDetalle.categoria);
    this.editUserForm.get('dedication')?.setValue(userInfoResponse.usuarioDetalle.dedicacion);
    this.editUserForm.get('state')?.setValue(userInfoResponse.estado);
  }

  isDisabledField(field: string) {
    return this.editUserForm.get(field)?.disabled;
  }

  isInvaldField(field: string) {
    const control = this.editUserForm.get(field);
    return control && control.errors && control.invalid && (control.dirty || control.touched);
  }

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

  disableFieldByRole(role: string)  {
    console.log(role);
    switch (role) {
      case 'Administrador':
        this.editUserForm.get('name')?.enable();
        this.editUserForm.get('lastName')?.enable();
        this.editUserForm.get('email')?.enable();
        this.editUserForm.get('idUser')?.enable();
        this.editUserForm.get('state')?.enable();
        break;
      case 'Docente':
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
      case 'Estudiante':
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

  updateUserInfo() {
    if(this.editUserForm.invalid) {return}
    let userUpdate:NewUser = {
      nombres: this.editUserForm.get('name')?.value,
      apellidos: this.editUserForm.get('lastName')?.value,
      correo: this.editUserForm.get('email')?.value,
      estado: this.editUserForm.get('state')?.value,
      usuarioDetalle: {
        identificacion: this.editUserForm.get('idUser')?.value,
        facultad: this.editUserForm.get('faculty')?.value,
        departamento: this.editUserForm.get('program')?.value,
        categoria: this.editUserForm.get('category')?.value,
        contratacion: this.editUserForm.get('typeContract')?.value,
        dedicacion: this.editUserForm.get('dedication')?.value,
        estudios: this.editUserForm.get('studies')?.value,
      },
      roles: [
        {
          oid: this.editUserForm.get('role')?.value === 'Estudiante' ? 3 : this.editUserForm.get('role')?.value === 'Docente' ? 2 : 1
        }
      ]
    }
    if(this.userInformation){
      this.UserServices.updateUsers(this.userInformation.oidUsuario, userUpdate).subscribe({
        next: (response) => {
          this.messageToast.showSuccessMessage('Usuario actualizado correctamente', 'Actualización exitosa');
          this.router.navigate(['/app/gestion-usuarios/usuarios']);
        },
        error: (error) => {
          this.messageToast.showErrorMessage('Error al actualizar el usuario', 'Error');
        }
      })
    }
  }

  changesInRoleField() {
    this.editUserForm.get('role')?.valueChanges.subscribe((value) => {
      this.disableField();
      this.disableFieldByRole(value);
    });
  }

  goBack() {
    this.router.navigate(['/app/gestion-usuarios/usuarios']);
  }
}
