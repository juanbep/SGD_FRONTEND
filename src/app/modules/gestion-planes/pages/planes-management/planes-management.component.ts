import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarPlanesComponent } from '../listar-planes/listar-planes.component';
import { ViewPlanDetailComponent } from '../view-plan-detail/view-plan-detail.component';

@Component({
  selector: 'app-planes-management',
  standalone: true,
  imports: [CommonModule, ListarPlanesComponent, ViewPlanDetailComponent ],
  templateUrl: './planes-management.component.html',
  styleUrl: './planes-management.component.css'
})
export class PlanesManagementComponent {

}
