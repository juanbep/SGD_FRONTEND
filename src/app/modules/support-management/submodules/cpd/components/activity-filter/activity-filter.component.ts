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
  private formBuilder = inject(FormBuilder);
  private catalogService = inject(CatalogDataService);

  @Output()
  public filterParams: EventEmitter<{ activityName: string | null, activityType: string | null }> = new EventEmitter<{ activityName: string | null, activityType: string | null }>();

  public catalogData: CatalogDataResponse | null = null;

  public formFilter = this.formBuilder.group({
    activityName: [''],
    activityType: [''],
  });

  ngOnInit(): void {
    this.catalogData = this.catalogService.catalogDataSignal;
  }

  public searchActivities() {
    const activityName = this.formFilter.get('activityName')?.value || '';
    const activityType = this.formFilter.get('activityType')?.value || '';
    this.filterParams.emit({ activityName, activityType });
  }

  public clearFilter() {
    this.formFilter.get('activityName')?.setValue('');
    this.formFilter.get('activityType')?.setValue('');
    this.filterParams.emit({ activityName: '', activityType: '' });
  }

}
