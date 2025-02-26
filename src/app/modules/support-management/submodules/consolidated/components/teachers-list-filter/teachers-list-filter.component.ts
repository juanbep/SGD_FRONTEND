import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CatalogServicesService } from '../../../../../../core/services/catalog-services.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'consolidated-teachers-list-filter',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './teachers-list-filter.component.html',
  styleUrl: './teachers-list-filter.component.css'
})
export class TeachersListFilterComponent {

  private catalogServicesService = inject(CatalogDataService);
  private formBuilder: FormBuilder = inject(FormBuilder);

  public catalogDataResponse: CatalogDataResponse | null = null;
  
  states = [
    { valor: 'default', texto: 'Estado' },
    { valor: 'opcion1', texto: 'Diligenciado' },
    { valor: 'opcion2', texto: 'Pendiente' },
  ]
  
  public valueState: string = this.states[0].texto;
  
  formFilter = this.formBuilder.group({
    state: ['null'],
    catagory: ['null'],
  })

  ngOnInit(): void {
    this.catalogDataResponse = this.catalogServicesService.catalogDataSignal;
  }

  searchTeachers() {
    const state = this.formFilter.get('state')?.value || '';
    const catagory = this.formFilter.get('catagory')?.value || '';
    console.log(state, catagory);
  }

  clearFilter() {
    this.formFilter.reset();
  }




}
