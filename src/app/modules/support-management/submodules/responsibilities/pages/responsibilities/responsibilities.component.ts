import { Component, inject } from '@angular/core';
import { ResponsibilitiesTableComponent } from "../../components/responsibilities-table/responsibilities-table.component";
import { ResponsibilitiesFilterComponent } from "../../components/responsibilities-filter/responsibilities-filter.component";
import { AuthServiceService } from '../../../../../auth/service/auth-service.service';

@Component({
  selector: 'support-management-responsibilities',
  standalone: true,
  imports: [ResponsibilitiesTableComponent, ResponsibilitiesFilterComponent],
  templateUrl: './responsibilities.component.html',
  styleUrl: './responsibilities.component.css'
})
export class ResponsibilitiesComponent {


  private authServiceService = inject(AuthServiceService);

  public currentUser = this.authServiceService.currentUser;

}
