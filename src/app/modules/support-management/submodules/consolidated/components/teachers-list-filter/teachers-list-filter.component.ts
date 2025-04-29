import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CatalogServicesService } from '../../../../../../core/services/catalog-services.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';

@Component({
  selector: 'consolidated-teachers-list-filter',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './teachers-list-filter.component.html',
  styleUrl: './teachers-list-filter.component.css',
})
export class TeachersListFilterComponent {
  private catalogServicesService = inject(CatalogDataService);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private consolidatedServicesService = inject(ConsolidatedServicesService);

  

  public catalogDataResponse: CatalogDataResponse | null = null;

  states = [
    { valor: 'default', texto: 'Estado' },
    { valor: 'opcion1', texto: 'Diligenciado' },
    { valor: 'opcion2', texto: 'Pendiente' },
  ];

  public valueState: string = this.states[0].texto;

  formFilter = this.formBuilder.group({
    evaluatedName: [''],
    contractType: [''],
    evaluatedId: [''],
  });

  ngOnInit(): void {
    this.catalogDataResponse = this.catalogServicesService.catalogDataSignal;
  }

  searchTeachers() {
    const evaluatedName = this.formFilter.get('evaluatedName')?.value || '';
    const contractType = this.formFilter.get('contractType')?.value || '';
    const evaluatedId = this.formFilter.get('evaluatedId')?.value || '';
    this.consolidatedServicesService.setFilterTeacherParams({
      evaluatedName: evaluatedName,
      contractType: contractType,
      evaluatedId: evaluatedId,
    });
  }

  clearFilter() {
    this.formFilter.get('evaluatedName')?.setValue('');
    this.formFilter.get('contractType')?.setValue('');
    this.formFilter.get('evaluatedId')?.setValue('');
    this.consolidatedServicesService.setFilterTeacherParams({
      evaluatedName: '',
      contractType: '',
      evaluatedId: '',
    });
  }
}
