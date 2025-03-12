import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { ResponsibilitiesServicesService } from '../../services/responsibilities-services.service';

@Component({
  selector: 'responsibilities-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './responsibilities-filter.component.html',
  styleUrl: './responsibilities-filter.component.css'
})
export class ResponsibilitiesFilterComponent {
 
     private formBuilder: FormBuilder = inject(FormBuilder);
     private catalogDataService = inject(CatalogDataService);
     private responsabiltitiesServicesService = inject(ResponsibilitiesServicesService);
   
     public catalogDataResponse: CatalogDataResponse | null = null; 
 
     formFilter: FormGroup = this.formBuilder.group({
       activityType: [null],
       activityName : [null],
       evaluatorName: [null],
       evaluatorRole  : [null],
     });
     
     ngOnInit(): void {
       this.recoverCatalog();
     }
   
     recoverCatalog(){
      this.catalogDataResponse = this.catalogDataService.catalogDataSignal;
     }
   
     searchActivities(){
      const activityType = this.formFilter.get('activityType')?.value;
      const activityName = this.formFilter.get('activityName')?.value;
      const evaluatorName = this.formFilter.get('evaluatorName')?.value;
      const evaluatorRole = this.formFilter.get('evaluatorRole')?.value;
      
      this.responsabiltitiesServicesService.setParamsActivitiesFilterSignal(activityName, activityType, evaluatorName, evaluatorRole);
     }
   
     clearFilter(){
       this.formFilter.reset();
       this.responsabiltitiesServicesService.setParamsActivitiesFilterSignal(null, null, null, null);
     }
}
