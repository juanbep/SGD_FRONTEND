import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CatalogServicesService } from '../../../../../../core/services/catalog-services.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { FormBuilder } from '@angular/forms';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';

@Component({
  selector: 'consolidated-teachers-list-filter',
  standalone: true,
  imports: [CommonModule],
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
    teacherName: [null],
    contractType: [null],
  });

  ngOnInit(): void {
    this.catalogDataResponse = this.catalogServicesService.catalogDataSignal;
  }

  searchTeachers() {
    const teacherName = this.formFilter.get('teacherName')?.value || '';
    const contractType = this.formFilter.get('contractType')?.value || '';
    this.consolidatedServicesService.setFilterTeacherParams({
      teacherType: teacherName,
      contractType: contractType,
    });
  }

  clearFilter() {
    this.formFilter.reset();
    this.consolidatedServicesService.setFilterTeacherParams({
      teacherType: '',
      contractType: '',
    });
  }
}
