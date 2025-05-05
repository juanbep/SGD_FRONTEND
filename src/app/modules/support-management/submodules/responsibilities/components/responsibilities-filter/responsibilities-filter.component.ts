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

  public filterParams: {
    activityName: string | null;
    activityType: string | null;
    evaluatorName: string | null;
    evaluatorRole: string | null;
  } | null = null;


  formFilter: FormGroup = this.formBuilder.group({
    activityType: [''],
    activityName: [''],
    evaluatorName: [''],
    evaluatorRole: [''],
  });

  ngOnInit(): void {
    this.recoverCatalog();
    const filterParams = this.responsabiltitiesServicesService.getParamsActivitiesFilterSignal();
    this.formFilter.get('activityName')?.setValue(filterParams.activityName);
    this.formFilter.get('activityType')?.setValue(filterParams.activityType);
    this.formFilter.get('evaluatorName')?.setValue(filterParams.evaluatorName);
    this.formFilter.get('evaluatorRole')?.setValue(filterParams.evaluatorRole);
  }

  recoverCatalog() {
    this.catalogDataResponse = this.catalogDataService.catalogDataSignal;
  }

  searchActivities() {
    const activityType = this.formFilter.get('activityType')?.value;
    const activityName = this.formFilter.get('activityName')?.value;
    const evaluatorName = this.formFilter.get('evaluatorName')?.value;
    const evaluatorRole = this.formFilter.get('evaluatorRole')?.value;

    this.responsabiltitiesServicesService.setParamsActivitiesFilterSignal(activityName, activityType, evaluatorName, evaluatorRole);
  }

  clearFilter() {
    this.formFilter.reset();
    this.responsabiltitiesServicesService.setParamsActivitiesFilterSignal('', '', '', '');
  }
}
