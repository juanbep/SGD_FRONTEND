import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'user-management-activities-users-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './users-filter.component.html',
  styleUrl: './users-filter.component.css'
})
export class UsersFilterComponent {
    private formBuilder: FormBuilder = inject(FormBuilder);
    public nameUserOptionSelected: string = '';
    public idUserOptionSelected: string = '';
    public facultyOptionSelected: string = 'default';
    
    formFilter: FormGroup = this.formBuilder.group({
      nameUser: [''],
      idUser: [''],
      faculty: ['default']
    })
    
    facultyOptions = [
      {
        value: 'default',
        text: 'Facultad'
      },
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
        value: 'default',
        text: 'Programa'
      },
      {
        value: 'opcion1',
        text: 'Ingeniería de Sistemas'
      },
      {
        value: 'opcion2',
        text: 'Ingeniería electrónica'
      }
    ]
  
    roleOptions = [
      {
        value: 'default',
        text: 'Rol'
      },
      {
        value: 'opcion1',
        text: 'Estudiante'
      },
      {
        value: 'opcion2',
        text: 'Docente'
      }
    ]
  
    stateOptions = [
      {
        value: 'default',
        text: 'Estado'
      },
      {
        value: 'opcion1',
        text: 'Activo'
      },
      {
        value: 'opcion2',
        text: 'Inactivo'
      }
    ]
    
    ngOnInit(): void {
      this.listenNameUserChanges();
    }
  
    public listenNameUserChanges() {
      this.formFilter.get('nameUser')?.valueChanges.subscribe((value) => {
        this.nameUserOptionSelected = value;
      })
    }
  
    public listenIdUserChanges() {
      this.formFilter.get('idUser')?.valueChanges.subscribe((value) => {
        this.idUserOptionSelected = value;
      })
    }
  
    public listenFacultyChanges() {
      this.formFilter.get('faculty')?.valueChanges.subscribe((value) => {
        this.facultyOptionSelected = value;
      })
    }
}
