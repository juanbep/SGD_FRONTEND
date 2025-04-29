import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CatalogDataService } from '../../../../../../shared/services/catalogData.service';
import { CatalogDataResponse } from '../../../../../../core/models/catalogData.interface';
import { ActivitiesPendingDefinitionEvaluatorServicesService } from '../../services/activities-pending-definition-evaluator-services.service';

@Component({
  selector: 'activities-pending-definition-evaluator-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './activities-pending-definition-evaluator-filter.component.html',
  styleUrl: './activities-pending-definition-evaluator-filter.component.css'
})
export class ActivitiesPendingDefinitionEvaluatorFilterComponent {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private catalogDataService = inject(CatalogDataService);
  private activitiesPendingDefinitionEvaluatorServicesService = inject(ActivitiesPendingDefinitionEvaluatorServicesService);

  public catalogDataResponse: CatalogDataResponse | null = null;

  formFilter: FormGroup = this.formBuilder.group({
    activityType: [''],
    activityName: [''],
    evaluatorName: [''],
    evaluatorRole: [''],
  });

  ngOnInit(): void {
    this.recoverCatalog();
  }

  recoverCatalog() {
    this.catalogDataResponse = this.catalogDataService.catalogDataSignal;
  }

  searchActivities() {
    const activityType = this.formFilter.get('activityType')?.value;
    const activityName = this.formFilter.get('activityName')?.value;
    const evaluatorName = this.formFilter.get('evaluatorName')?.value;
    const evaluatorRole = this.formFilter.get('evaluatorRole')?.value;

    this.activitiesPendingDefinitionEvaluatorServicesService.setParamsActivitiesFilterSignal({ activityName, activityType, evaluatedName: evaluatorName, evaluatedRole: evaluatorRole });
  }

  clearFilter() {
    this.formFilter.get('activityType')?.setValue('');
    this.formFilter.get('activityName')?.setValue('');
    this.formFilter.get('evaluatorName')?.setValue('');
    this.formFilter.get('evaluatorRole')?.setValue('');
    this.activitiesPendingDefinitionEvaluatorServicesService.setParamsActivitiesFilterSignal({ activityName: '', activityType: '', evaluatedName: '', evaluatedRole: '' });
  }
}
