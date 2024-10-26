import { Component, OnInit } from '@angular/core';
import { SearchResponse } from '../../../../core/labor.interfaces';
import { Actividad, ActividadesPorTipoActividad } from '../../../../core/activities.interface';

import { CommonModule } from '@angular/common';
import { SupportMangementComponent } from '../../pages/support-mangement/support-mangement.component';
import { SupportManagementService } from '../../services/support-management.service';
import { } from '@angular/common/http';


@Component({
  selector: 'supportManagement-table-activities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-activities.component.html',
  styleUrl: './table-activities.component.css',
})


export class TableActivitiesComponent implements OnInit {

  public activitiesByType!: ActividadesPorTipoActividad[];

  constructor (private activitieService: SupportManagementService ) {}

    public headDataTable = ["Actividades","Autoevaluación","Fuente 2"]
    
    public subHeadDataTable = ["Nombre actividad","Estado","Acciones","Evaluador","Rol Evaluador","Estado","Acciones"]

    public activities: Actividad[] = [];

  ngOnInit(): void {
    this.activitieService.allActivities().subscribe(activities=>{
      this.activities = activities;
      this.reloadActivities();
    })
    
  }

  public reloadActivities() {
     this.activitiesByType = Object.values(
      this.activities.reduce((acc, activity) => {
        const tipoNombre = activity.tipoActividad.nombre;
    
        // Si el tipo de actividad no existe como clave, la inicializamos
        if (!acc[tipoNombre]) {
          acc[tipoNombre] = {
            nombreType: tipoNombre,
            activities: []
          };
        }
    
        // Añadimos la actividad al grupo correspondiente
        acc[tipoNombre].activities.push(activity);
    
        return acc;
      }, {} as { [key: string]: ActividadesPorTipoActividad })
    );
    }


}
