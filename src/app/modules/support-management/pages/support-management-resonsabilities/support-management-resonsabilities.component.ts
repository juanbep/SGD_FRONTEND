import { Component, OnInit } from '@angular/core';
import { TableActivitiesResponsabilitiesComponent } from "../../components/table-activities-responsabilities/table-activities-responsabilities.component";
import { FiltersComponent } from "../../components/filters/filters.component";
import { SupportManagementResponsabilitiesService } from '../../services/support-management-responabilities.service';

@Component({
  selector: 'app-support-management-resonsabilities',
  standalone: true,
  imports: [TableActivitiesResponsabilitiesComponent, FiltersComponent],
  templateUrl: './support-management-resonsabilities.component.html',
  styleUrl: './support-management-resonsabilities.component.css'
})

export class SupportManagementResonsabilitiesComponent implements OnInit {

  ngOnInit(): void {

  }

}
