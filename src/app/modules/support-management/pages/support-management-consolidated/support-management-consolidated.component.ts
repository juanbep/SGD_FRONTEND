import { Component } from '@angular/core';
import { TableUsersConsolidatedComponent } from '../../components/table-users-consolidated/table-users-consolidated.component';
import { FilterTeachersConsolidatedComponent } from '../../components/filter-teachers-consolidated/filter-teachers-consolidated.component';

@Component({
  selector: 'app-support-management-consolidated',
  standalone: true,
  imports: [TableUsersConsolidatedComponent, FilterTeachersConsolidatedComponent],
  templateUrl: './support-management-consolidated.component.html',
  styleUrl: './support-management-consolidated.component.css'
})
export class SupportManagementConsolidatedComponent {

}
