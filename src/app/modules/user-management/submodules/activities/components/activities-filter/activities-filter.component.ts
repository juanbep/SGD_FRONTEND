import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CommonModule } from '@angular/common';

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


  public catalogDataResponse: CatalogDataResponse | null = null;
  
  formFilter: FormGroup = this.formBuilder.group({
    activityTyoe: [''],
    code: [''],
    administrativeAct: [''],
    CodVRI: [''],
    totalHours: [''],
  });
  
  ngOnInit(): void {
    this.recoverCatalog();
  }

  recoverCatalog(){
   this.catalogDataService.getCatalogData().subscribe((response)=>{
      this.catalogDataResponse = response;
    })
  }
}
