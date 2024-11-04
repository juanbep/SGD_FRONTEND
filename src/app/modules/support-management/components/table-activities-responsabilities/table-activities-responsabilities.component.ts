import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'support-management-table-activities-responsabilities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-activities-responsabilities.component.html',
  styleUrl: './table-activities-responsabilities.component.css'
})
export class TableActivitiesResponsabilitiesComponent {
  public headDataTable = ["Actividad","Fuente 2"];
  
  public headDataTableCoodinator = ["Actividad","Fuente", "Informe"];

  public subHeadDataTableStudents = ["Nombre actividad","Evaluado","Rol evaluado","Estado soporte","Acciones"];

  public subHeadDataTableCoorinator = ["Nombre actividad","Evaluado","Rol evaluado","Estado soporte","Acciones", "Acciones"];



}
