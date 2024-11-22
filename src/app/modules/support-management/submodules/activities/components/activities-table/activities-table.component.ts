import { Component } from '@angular/core';
import { Actividad, ActividadesPorTipoActividad } from '../../../../../../core/activities.interface';
import { SupportManagementService } from '../../../../services/support-management.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'activities-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activities-table.component.html',
  styleUrl: './activities-table.component.css'
})
export class ActivitiesTableComponent {

  public activities: Actividad[] = [];
  public activitiesByType!: ActividadesPorTipoActividad[];
  public headDataTable = ["Actividades", "Autoevaluación", "Fuente 2"]
  public subHeadDataTable = ["Nombre actividad", "Estado", "Acciones", "Evaluador", "Rol Evaluador", "Estado", "Acciones"]
  public openModalSelected: boolean = false;
  public activitySelected: Actividad | undefined;
  public sourceSelected: 1 | 2 | undefined;
  
  constructor(private activitieService: SupportManagementService) { }


  ngOnInit(): void {

    this.activitieService.allActivitiesByUser('6');

    this.activitieService.getDataActivities().subscribe(data => {
      this.activities = data;
      this.reloadActivities();
    })

  }

  public openModal(activity: Actividad, source: 1 | 2) {
    this.openModalSelected = !this.openModalSelected;
    this.sourceSelected = source;
    this.activitySelected = activity;
  }

  public closeModal(event: boolean) {
    this.openModalSelected = !event;
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
