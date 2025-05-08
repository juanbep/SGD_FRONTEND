import { Component, EventEmitter, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CpdServicesService } from '../../../cpd/services/cpd-services.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'historical-user-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-filter.component.html',
  styleUrl: './user-filter.component.css'
})
export class UserFilterComponent {
 private formBuilder = inject(FormBuilder);
  private catalogService = inject(CatalogDataService);
  private cpdServiceService = inject(CpdServicesService);

  public filterParams: EventEmitter<{ nameUser: string | null, identification: string | null, category: string | null, department:string | null }> = new EventEmitter<{ nameUser: string | null, identification: string | null, category: string | null, department:string | null  }>();

  public catalogData: CatalogDataResponse | null = null;


  public formFilter = this.formBuilder.group({
    nameUser: [''],
    identification: [''],
    category: [''],
    department: [''],
  });

  ngOnInit(): void {
    this.catalogData = this.catalogService.catalogDataSignal;
    const filterParams = this.cpdServiceService.getFilterTeacherParams();
    this.formFilter.get('nameUser')?.setValue(filterParams.evaluatedName || '');
    this.formFilter.get('identification')?.setValue(filterParams.evaluatedId || '');
    this.formFilter.get('category')?.setValue(filterParams.category || '');
    this.formFilter.get('department')?.setValue(filterParams.department || '');
  }

  public searchUsers() {

    const nameUser = this.formFilter.get('nameUser')?.value || '';
    const identification = this.formFilter.get('identification')?.value || '';
    const category = this.formFilter.get('category')?.value || '';
    const department = this.formFilter.get('department')?.value || '';

    this.cpdServiceService.setFilterTeacherParams({
      evaluatedName: nameUser,
      evaluatedId: identification,
      category: category,
      department: department
    });
  }

  public clearFilter() {
    this.formFilter.get('nameUser')?.setValue('');
    this.formFilter.get('identification')?.setValue('');
    this.formFilter.get('category')?.setValue('');
    this.formFilter.get('department')?.setValue('');

    this.cpdServiceService.setFilterTeacherParams({
      evaluatedName: null,
      evaluatedId: null,
      category: null,
      department: null
    });

  }
}
