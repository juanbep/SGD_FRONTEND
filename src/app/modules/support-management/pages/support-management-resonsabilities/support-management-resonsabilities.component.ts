import { Component } from '@angular/core';
import { TableActivitiesResponsabilitiesComponent } from "../../components/table-activities-responsabilities/table-activities-responsabilities.component";
import { FiltersComponent } from "../../components/filters/filters.component";

@Component({
  selector: 'app-support-management-resonsabilities',
  standalone: true,
  imports: [TableActivitiesResponsabilitiesComponent, FiltersComponent],
  templateUrl: './support-management-resonsabilities.component.html',
  styleUrl: './support-management-resonsabilities.component.css'
})
export class SupportManagementResonsabilitiesComponent {

}
