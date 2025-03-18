import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ConsolidatedServicesService } from '../../services/consolidated-services.service';

@Component({
  selector: 'consolidated-teacher-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consolidated-teacher-filter.component.html',
  styleUrl: './consolidated-teacher-filter.component.css',
})
export class ConsolidatedTeacherFilterComponent implements OnInit {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private ConsolidatedServicesService = inject(ConsolidatedServicesService);
  private cataglogDataService = inject(CatalogDataService);

  public catalogData: CatalogDataResponse | null = null;

  formFilter: FormGroup = this.formBuilder.group({
    activityName: [null],
    activityType: [null],
    sourceType: [null],
    sourceState: [null],
  });

  ngOnInit(): void {
    this.catalogData = this.cataglogDataService.catalogDataSignal;
  }

  filterAction() {
    const activityType = this.formFilter.get('activityType')?.value || '';
    const activityName = this.formFilter.get('activityName')?.value || '';
    const sourceType = this.formFilter.get('sourceType')?.value || '';
    const sourceState = this.formFilter.get('sourceState')?.value || '';
    this.ConsolidatedServicesService.setFilterActivitiesParams({
      activityType,
      activityName,
      sourceType,
      sourceState,
    });
  }

  clearAction() {
    this.formFilter.reset();
    this.ConsolidatedServicesService.setFilterActivitiesParams({
      activityType: null,
      activityName: null,
      sourceType: null,
      sourceState: null,
    });
  }
}
