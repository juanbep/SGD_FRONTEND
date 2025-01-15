import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { UsersServiceService } from '../../services/users-service.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import { NewUser } from '../../../../../../core/models/users.interfaces';

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

  public messageConfirmDialog: string = '¿Está seguro de crear el usuario?';
  public titleConfirmDialog: string = 'Confirmar creación de usuario';

  private formBuilder: FormBuilder = inject(FormBuilder);
  private messageToast = inject(MessagesInfoService);
  private userServices = inject(UsersServiceService);
  private validatorsService = inject(ValidatorsService);

  newUserForm: FormGroup = this.formBuilder.group({
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


  roleOptions = [
    {
      value: '3',
      text: 'administrador'
    },
    {
      value: '1',
      text: 'Docente'
    },
    {
      value: '2',
      text: 'Estudiante'
    }
  ]

  facultyOptions = [
    {
      value: 'Facultad de Ingeniería Electrónica y Telecomunicaciones',
      text: 'FIET'
    },
    {
      value: 'opcion2',
      text: 'Automática'
    }
  ]

  programOptions = [
    {
      value: 'Sistemas',
      text: 'Sistemas'
    },
    {
      value: 'Electrónica',
      text: 'Ingeniería electrónica'
    }
  ]

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

  typeContractOptions = [
    {
      value: 'opcion1',
      text: 'Tiempo completo'
    },
    {
      value: 'opcion2',
      text: 'Medio tiempo'
    }
  ]

  studiesOptions = [
    {
      value: 'opcion1',
      text: 'Pregrado'
    },
    {
      value: 'opcion2',
      text: 'Maestría'
    },
    {
      value: 'opcion3',
      text: 'Doctorado'
    }
  ]

  categoryOptions = [
    {
      value: 'opcion1',
      text: 'Asistente'
    },
    {
      value: 'opcion2',
      text: 'Asociado'
    },
    {
      value: 'opcion3',
      text: 'Titular'
    }
  ]

  dedicationOptions = [
    {
      value: 'opcion1',
      text: 'Tiempo completo'
    },
    {
      value: 'opcion2',
      text: 'Medio tiempo'
    }
  ]


  ngOnInit(): void {
    this.disableField();
    this.changesInRoleField();
  }

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

  isDisabledField(field: string) {
    return this.newUserForm.get(field)?.disabled;
  }

  isInvaldField(field: string) {
    const control = this.newUserForm.get(field);
    return control && control.errors && control.invalid && (control.dirty || control.touched);
  }


  changesInRoleField() {
    this.newUserForm.get('role')?.valueChanges.subscribe((value) => {
      this.disableField();
      switch (value) {
        case '3':
          this.newUserForm.get('name')?.enable();
          this.newUserForm.get('lastName')?.enable();
          this.newUserForm.get('email')?.enable();
          this.newUserForm.get('idUser')?.enable();
          this.newUserForm.get('state')?.enable();
          break;
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
        case '2':
          this.newUserForm.get('name')?.enable();
          this.newUserForm.get('lastName')?.enable();
          this.newUserForm.get('email')?.enable();
          this.newUserForm.get('idUser')?.enable();
          this.newUserForm.get('faculty')?.enable();
          this.newUserForm.get('program')?.enable();
          this.newUserForm.get('state')?.enable();
          break;
        default:
          break;
      }
    });
  }

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

  openConfirmDialog() {
    this.confirmDialog.open();
  }

  closeConfirmDialog() {
    this.confirmDialog.close();
  }

  onConfirm(event: boolean | void): void {
    if (event) {
      this.newUserForm.markAllAsTouched();
      if (this.newUserForm.valid) {
        let newUser: NewUser = {
          nombres: this.newUserForm.get('name')?.value,
          apellidos: this.newUserForm.get('lastName')?.value,
          correo: this.newUserForm.get('email')?.value,
          estado: this.newUserForm.get('state')?.value,
          usuarioDetalle: {
            identificacion: this.newUserForm.get('idUser')?.value,
            facultad: this.newUserForm.get('faculty')?.value,
            departamento: this.newUserForm.get('program')?.value,
            categoria: this.newUserForm.get('category')?.value,
            contratacion: this.newUserForm.get('typeContract')?.value,
            dedicacion: this.newUserForm.get('dedication')?.value,
            estudios: this.newUserForm.get('studies')?.value,
          },
          roles: [
            {
              oid: this.newUserForm.get('role')?.value
            }
          ]
        }
        this.userServices.saveUser(newUser).subscribe(
          {
            next: () => {
              this.messageToast.showSuccessMessage('Usuario creado correctamente', 'Usuario creado');
              this.clearFormFields();
              this.closeConfirmDialog();
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

  goBack() {
    window.history.back();
  }

  clearFormFields() {
    this.newUserForm.reset();
  }


}
