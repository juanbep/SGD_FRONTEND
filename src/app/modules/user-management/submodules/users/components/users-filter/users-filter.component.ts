import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { UsersServiceService } from '../../services/users-service.service';

@Component({
  selector: 'users-management-users-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
],
  templateUrl: './users-filter.component.html',
  styleUrl: './users-filter.component.css'
})
export class UsersFilterComponent implements OnInit {

  private formBuilder: FormBuilder = inject(FormBuilder);
  private userServices = inject(UsersServiceService);
  private catalogDataService = inject(CatalogDataService);

  public catalogData:CatalogDataResponse | null = null;

  public filterParams: {nameUser: string | null, identification: string | null, faculty: string | null, program: string | null, rol: string | null, state: string | null} | null = null;

  
  formFilter: FormGroup = this.formBuilder.group({
    nameUser: [''],
    identification: [''],
    faculty: [''],
    program: [''],
    rol:  [''],
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
    this.catalogData = this.catalogDataService.catalogDataSignal;
    const paramsFilter = this.userServices.getParamsFilter();
    this.formFilter.get('nameUser')?.setValue(paramsFilter?.nameUser || '');
    this.formFilter.get('identification')?.setValue(paramsFilter?.identification || '');
    this.formFilter.get('faculty')?.setValue(paramsFilter?.faculty || '');
    this.formFilter.get('program')?.setValue(paramsFilter?.program || '');
    this.formFilter.get('rol')?.setValue(paramsFilter?.rol || '');
    this.formFilter.get('state')?.setValue(paramsFilter?.state || '');
    
  }



  searchUsers() {
    const nameUser = this.formFilter.get('nameUser')?.value || '';
    const identification = this.formFilter.get('identification')?.value || '';
    const faculty = this.formFilter.get('faculty')?.value || '';
    const program = this.formFilter.get('program')?.value || '';
    const rol = this.formFilter.get('rol')?.value || '';
    const state = this.formFilter.get('state')?.value || '';

    this.userServices.setParamsFilter({nameUser, identification, faculty, program, rol, state});
  }

  clearFilter() {
    this.formFilter.get('nameUser')?.setValue('');
    this.formFilter.get('identification')?.setValue('');
    this.formFilter.get('faculty')?.setValue('');
    this.formFilter.get('program')?.setValue('');
    this.formFilter.get('state')?.setValue('');
    this.formFilter.get('rol')?.setValue('');
    
    this.userServices.setParamsFilter({nameUser: '', identification: '', faculty: '', program: '', rol: '', state: ''});
  }

}
