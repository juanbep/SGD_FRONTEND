import { Component, OnInit } from '@angular/core';
import { TableActivitiesResponsabilitiesComponent } from "../../components/table-activities-responsabilities/table-activities-responsabilities.component";
import { FiltersComponent } from "../../components/filters-self-assesment/filters.component";
import { SupportManagementResponsabilitiesService } from '../../services/support-management-responabilities.service';
import { FilterResposabilitiesComponent } from "../../components/filter-resposabilities/filter-resposabilities.component";

@Component({
  selector: 'app-support-management-resonsabilities',
  standalone: true,
  imports: [TableActivitiesResponsabilitiesComponent, FiltersComponent, FilterResposabilitiesComponent],
  templateUrl: './support-management-resonsabilities.component.html',
  styleUrl: './support-management-resonsabilities.component.css'
})

export class SupportManagementResonsabilitiesComponent implements OnInit {

  ngOnInit(): void {

  }

}
