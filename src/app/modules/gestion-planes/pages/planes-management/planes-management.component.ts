import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarPlanesComponent } from '../listar-planes/listar-planes.component';

@Component({
  selector: 'app-planes-management',
  standalone: true,
  imports: [CommonModule, ListarPlanesComponent],
  templateUrl: './planes-management.component.html',
  styleUrl: './planes-management.component.css'
})
export class PlanesManagementComponent {

}
