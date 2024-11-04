import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SupportManagementResponsabilitiesService } from '../../services/support-management-responabilities.service';
import { Responsabilidad, ResponsabilidadesPorTipoActividad } from '../../../../core/responsabilitie.interface';

@Component({
  selector: 'support-management-table-activities-responsabilities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-activities-responsabilities.component.html',
  styleUrl: './table-activities-responsabilities.component.css'
})
export class TableActivitiesResponsabilitiesComponent implements OnInit{
  public headDataTable = ["Actividad","Fuente 2"];
  
  public headDataTableCoodinator = ["Actividad","Fuente", "Informe"];
  
  public subHeadDataTableStudents = ["Nombre actividad","Evaluado","Rol evaluado","Estado soporte","Acciones"];
  
  public subHeadDataTableCoorinator = ["Nombre actividad","Evaluado","Rol evaluado","Estado soporte","Acciones", "Acciones"];
  
  public responsabilities : Responsabilidad[] = [];

  public responsabilitieByType: ResponsabilidadesPorTipoActividad[] = [];
  
  constructor(private service: SupportManagementResponsabilitiesService){}

  ngOnInit(): void {
    this.service.allResponsabilitiesByUser("5").subscribe(responsabilitie => {
      this.responsabilities = responsabilitie;
      this.reloadActivities();
    })
  }


  public reloadActivities() {
    this.responsabilitieByType = Object.values(
      this.responsabilities.reduce((acc, responsabiltite) => {
        const tipoNombre = responsabiltite.tipoActividad.nombre;

        // Si el tipo de actividad no existe como clave, la inicializamos
        if (!acc[tipoNombre]) {
          acc[tipoNombre] = {
            nombreType: tipoNombre,
            activities: []
          };
        }

        // Añadimos la actividad al grupo correspondiente
        acc[tipoNombre].activities.push(responsabiltite);

        return acc;
      }, {} as { [key: string]: ResponsabilidadesPorTipoActividad })
    );
  }
  

  

}
