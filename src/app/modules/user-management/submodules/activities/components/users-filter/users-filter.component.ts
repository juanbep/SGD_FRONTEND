import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { CommonModule } from '@angular/common';
import { ActivitiesManagementService } from '../../services/activities-management.service';

@Component({
  selector: 'user-management-activities-users-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './users-filter.component.html',
  styleUrl: './users-filter.component.css'
})
export class UsersFilterComponent implements OnInit {


  private formBuilder: FormBuilder = inject(FormBuilder);
  private activitiesServices = inject(ActivitiesManagementService);
  private catalogService = inject(CatalogDataService);  
  public catalogData: CatalogDataResponse | null = null;

  public filterParams: {nameUser: string | null, identification: string | null, faculty: string | null, program: string | null, rol: string | null, state: string | null} | null = null;


  formFilter: FormGroup = this.formBuilder.group({
    nameUser: [''],
    identification: [''],
    faculty: [''],
    program: [''],
    state: ['']
  })

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
    this.catalogData = this.catalogService.catalogDataSignal;
    const paramsFilter = this.activitiesServices.getParamsUsersFilter();
    this.formFilter.get('nameUser')?.setValue(paramsFilter?.nameUser || '');
    this.formFilter.get('identification')?.setValue(paramsFilter?.identification || '');
    this.formFilter.get('faculty')?.setValue(paramsFilter?.faculty || '');
    this.formFilter.get('program')?.setValue(paramsFilter?.program || '');
    this.formFilter.get('state')?.setValue(paramsFilter?.state || '');
    this.formFilter.get('rol')?.setValue(paramsFilter?.rol || '');
    
  }

  searchUsers() {
    const nameUser = this.formFilter.get('nameUser')?.value || '';
    const identification = this.formFilter.get('identification')?.value || '';
    const faculty = this.formFilter.get('faculty')?.value || '';
    const program = this.formFilter.get('program')?.value || '';
    const rol = 'DOCENTE';
    const state = this.formFilter.get('state')?.value || '';

    this.activitiesServices.setParamsUsersFilter({ nameUser, identification, faculty, program, rol, state });
  }

  clearFilter() {
    this.formFilter.get('nameUser')?.setValue('');
    this.formFilter.get('identification')?.setValue('');
    this.formFilter.get('faculty')?.setValue('');
    this.formFilter.get('program')?.setValue('');
    this.formFilter.get('state')?.setValue('');
    this.formFilter.get('rol')?.setValue('DOCENTE');
    this.activitiesServices.setParamsUsersFilter({ nameUser: '', identification: '', faculty: '', program: '', rol: 'DOCENTE', state: '' });
  }
}
