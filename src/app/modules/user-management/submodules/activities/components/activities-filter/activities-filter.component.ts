import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CommonModule } from '@angular/common';
import { ActivitiesManagementService } from '../../services/activities-management.service';

@Component({
  selector: 'user-management-activities-activities-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './activities-filter.component.html',
  styleUrl: './activities-filter.component.css'
})
export class ActivitiesFilterComponent implements OnInit {
  
  private formBuilder: FormBuilder = inject(FormBuilder);
  private catalogDataService = inject(CatalogDataService);

  private activityManagementService = inject(ActivitiesManagementService);
  public catalogDataResponse: CatalogDataResponse | null = null;

  public filterParams: {nameActivity: string | null, typeActivity: string | null, activityCode: string | null, administrativeCode: string | null, vriCode: string | null} | null = null;

  
  formFilter: FormGroup = this.formBuilder.group({
    activityType: [''],
    activityName : [''],
    activityCode: [''],
    administrativeAct: [''],
    vriCode: [''],
  });
  
  ngOnInit(): void {
    this.recoverCatalog();
    
    const paramsFilter = this.activityManagementService.getParamsActivitiesFilter();
    this.formFilter.get('activityType')?.setValue(paramsFilter?.typeActivity || '');
    this.formFilter.get('activityName')?.setValue(paramsFilter?.nameActivity || '');
  }

  recoverCatalog(){
   this.catalogDataResponse = this.catalogDataService.catalogDataSignal;
  }

  searchActivities(){
    const activityType = this.formFilter.get('activityType')?.value;
    const activityName = this.formFilter.get('activityName')?.value;
    const activityCode = this.formFilter.get('activityCode')?.value;
    const administrativeAct = this.formFilter.get('administrativeAct')?.value;
    const vriCode = this.formFilter.get('vriCode')?.value;
    
    this.activityManagementService.setParamsActivitiesFilter({nameActivity: activityName, typeActivity: activityType, activityCode: activityCode, administrativeCode: administrativeAct, vriCode: vriCode});

  }

  clearFilter(){
    this.formFilter.get('activityType')?.setValue('');
    this.formFilter.get('activityName')?.setValue('');
    this.formFilter.get('activityCode')?.setValue('');
    this.formFilter.get('administrativeAct')?.setValue('');
    this.formFilter.get('vriCode')?.setValue('');
    this.activityManagementService.setParamsActivitiesFilter({nameActivity: '', typeActivity: '', activityCode: '', administrativeCode: '', vriCode: ''});
  }

}
