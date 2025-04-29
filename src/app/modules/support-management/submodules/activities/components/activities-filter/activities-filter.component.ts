import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { ActivitiesServicesService } from '../../services/activities-services.service';

@Component({
  selector: 'activities-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './activities-filter.component.html',
  styleUrl: './activities-filter.component.css'
})
export class ActivitiesFilterComponent {

    private formBuilder: FormBuilder = inject(FormBuilder);
    private catalogDataService = inject(CatalogDataService);
    private activitiesServicesService = inject(ActivitiesServicesService);
  
    public catalogDataResponse: CatalogDataResponse | null = null; 

    formFilter: FormGroup = this.formBuilder.group({
      activityType: [''],
      activityName : [''],
      evaluatorName: [''],
      evaluatorRole  : [''],
    });
    
    ngOnInit(): void {
      this.recoverCatalog();
    }
  
    recoverCatalog(){
     this.catalogDataResponse = this.catalogDataService.catalogDataSignal;
    }
  
    searchActivities(){
      const activityType = this.formFilter.get('activityType')?.value || '';
      const activityName = this.formFilter.get('activityName')?.value || '';
      const evaluatorName = this.formFilter.get('evaluatorName')?.value || '';
      const evaluatorRole = this.formFilter.get('evaluatorRole')?.value   || '';
      this.activitiesServicesService.setParamsActivitiesFilterSignal(activityName, activityType, evaluatorName, evaluatorRole);
    }
  
    clearFilter(){
      this.formFilter.get('activityType')?.setValue('');
      this.formFilter.get('activityName')?.setValue('');
      this.formFilter.get('evaluatorName')?.setValue('');
      this.formFilter.get('evaluatorRole')?.setValue('');
      this.activitiesServicesService.setParamsActivitiesFilterSignal('', '', '', '');
    }
  
}
