import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';

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
       const activityCode = this.formFilter.get('activityCode')?.value;
       const administrativeAct = this.formFilter.get('administrativeAct')?.value;
       const vriCode = this.formFilter.get('vriCode')?.value;
       
   
     }
   
     clearFilter(){
       this.formFilter.reset();
     }
}
