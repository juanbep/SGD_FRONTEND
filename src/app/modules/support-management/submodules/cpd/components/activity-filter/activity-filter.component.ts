import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cpd-activity-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './activity-filter.component.html',
  styleUrl: './activity-filter.component.css'
})
export class ActivityFilterComponent {
  private formBuilder= inject(FormBuilder);
    private catalogService = inject(CatalogDataService);
  
    @Output()
    public filterParams:EventEmitter<{activityName:string | null, activityType:string | null}> = new EventEmitter<{activityName: string | null, activityType:string | null}>();
  
    public catalogData: CatalogDataResponse | null = null;
    
    public formFilter = this.formBuilder.group({
      activityName: [null],
      activityType: [null],
    });
    
    ngOnInit(): void {
      this.catalogData = this.catalogService.catalogDataSignal;
    }
  
    public searchActivities(){
        const activityName = this.formFilter.get('activityName')?.value || null;
        const activityType = this.formFilter.get('activityType')?.value || null;
        this.filterParams.emit({activityName, activityType});
    }
  
    public clearFilter(){
      this.formFilter.reset();
      this.filterParams.emit({activityName: null, activityType: null});
    }
  
}
