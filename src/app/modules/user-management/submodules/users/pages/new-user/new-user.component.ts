import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'user-management-new-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.css'
})
export class NewUserComponent implements OnInit {

  private formBuilder: FormBuilder = inject(FormBuilder);

  newUserForm: FormGroup = this.formBuilder.group({
    role: [null, Validators.required],
    name: [null, Validators.required],
    lastName: [null, Validators.required],
    email: [null, Validators.required],
    idUser: [null, Validators.required],
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
      value: 'administrador',
      text: 'administrador'
    },
    {
      value: 'docente',
      text: 'Docente'
    },
    {
      value: 'estudiante',
      text: 'Estudiante'
    }
  ]

  facultyOptions = [
    {
      value: 'opcion1',
      text: 'FIET'
    },
    {
      value: 'opcion2',
      text: 'Automática'
    }
  ]

  programOptions = [
    {
      value: 'opcion1',
      text: 'Ingeniería de Sistemas'
    },
    {
      value: 'opcion2',
      text: 'Ingeniería electrónica'
    }
  ]

  stateOptions = [
    {
      value: 'opcion1',
      text: 'Activo'
    },
    {
      value: 'opcion2',
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
    console.log(this.newUserForm.get(field));
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
        case 'administrador':
          this.newUserForm.get('name')?.enable();
          this.newUserForm.get('lastName')?.enable();
          this.newUserForm.get('email')?.enable();
          this.newUserForm.get('idUser')?.enable();
          this.newUserForm.get('state')?.enable();

          break;
        case 'docente':
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
        case 'estudiante':
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
    if(!this.newUserForm.controls[field]) return null;

    const control = this.newUserForm.controls[field];
    const errors = control.errors || {};

    for(const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        default:
          return null;
      }
    }
    return null;
  }

}
