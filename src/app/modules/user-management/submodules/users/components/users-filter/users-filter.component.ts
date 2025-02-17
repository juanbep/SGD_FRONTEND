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

  private catalogDataService = inject(CatalogDataService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private userServices = inject(UsersServiceService);

  public catalogData:CatalogDataResponse | null = null;
  
  formFilter: FormGroup = this.formBuilder.group({
    nameUser: [null],
    identification: [null],
    faculty: [null],
    program: [null],
    rol:  [null],
    state: [null]
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
    this.recoverCatalogs();
  }
  
  public recoverCatalogs() {
    this.catalogData = this.catalogDataService.catalogDataSignal;
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
    this.formFilter.reset();
    this.userServices.setParamsFilter({nameUser: '', identification: '', faculty: '', program: '', rol: '', state: ''});
  }

}
