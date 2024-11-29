import { Component, effect } from '@angular/core';
import { Actividad, ActividadesPorTipoActividad } from '../../../../../../core/models/activities.interface';
import { CommonModule } from '@angular/common';
import { ActivitiesViewEvaluationComponent } from "../activities-view-evaluation/activities-view-evaluation.component";
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ActivitiesEditEvaluationComponent } from "../activities-edit-evaluation/activities-edit-evaluation.component";

@Component({
  selector: 'activities-table',
  standalone: true,
  imports: [CommonModule, ActivitiesViewEvaluationComponent, ActivitiesEditEvaluationComponent],
  templateUrl: './activities-table.component.html',
  styleUrl: './activities-table.component.css'
})
export class ActivitiesTableComponent {

  public activities: Actividad[] = [];
  public activitiesByType!: ActividadesPorTipoActividad[];
  public headDataTable = ["Actividades", "Autoevaluación", "Fuente 2"]
  public subHeadDataTable = ["Nombre actividad", "Estado", "Acciones", "Evaluador", "Rol Evaluador", "Estado", "Acciones"]
  public openModalViewSelected: boolean = false;
  public openModalEditSelected: boolean = false;
  public activitySelected: Actividad | undefined;
  public sourceSelected: 1 | 2 | undefined;
  
  constructor(private service: ActivitiesServicesService, private toastr: MessagesInfoService) {
    effect(() => {
      this.activities = this.service.getDataActivities();
      this.reloadActivities();
    });
   }

  ngOnInit(): void {
    this.service.getActivities('6', '', '', '', '').subscribe({
       next: data => {
        this.service.setDataActivities(data);
       },
       error: error => {
        this.toastr.showErrorMessage('Error al consultar la información', 'Error');
      } 
    });
 
  }

  public openModalView(activity: Actividad, source: 1 | 2) {
    this.openModalViewSelected = !this.openModalViewSelected;
    this.sourceSelected = source;
    this.activitySelected = activity;
  }

  public openModalEdit(activity: Actividad) {
    this.openModalEditSelected = !this.openModalEditSelected;
    this.activitySelected = activity;
  }

  public closeModalView(event: boolean) {
    this.openModalViewSelected = !event;
    console.log(this.openModalViewSelected);
  }

  public closeModalEdit(event: boolean) {
    this.openModalEditSelected = !event;
    console.log(this.openModalViewSelected);
  }
  
  public reloadActivities() {
    if(this.activities){
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
}
