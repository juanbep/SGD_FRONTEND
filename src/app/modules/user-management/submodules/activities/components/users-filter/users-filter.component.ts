import { Component, inject } from '@angular/core';
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
export class UsersFilterComponent {


  private catalogDataService = inject(CatalogDataService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private activitiesServices = inject(ActivitiesManagementService);

  public catalogData: CatalogDataResponse | null = null;

  formFilter: FormGroup = this.formBuilder.group({
    nameUser: [null],
    identification: [null],
    faculty: [null],
    program: [null],
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
    const rol = 'DOCENTE';
    const state = this.formFilter.get('state')?.value || '';

    this.activitiesServices.setParamsUsersFilter({ nameUser, identification, faculty, program, rol, state });
  }

  clearFilter() {
    this.formFilter.reset();
    this.activitiesServices.setParamsUsersFilter({ nameUser: '', identification: '', faculty: '', program: '', rol: 'DOCENTE', state: '' });
  }
}
