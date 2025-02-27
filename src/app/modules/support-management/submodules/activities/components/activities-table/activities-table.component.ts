import { Component, effect, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesViewEvaluationComponent } from "../activities-view-evaluation/activities-view-evaluation.component";
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { PaginatorComponent } from "../../../../../../shared/components/paginator/paginator.component";
import { UserInfo } from '../../../../../../core/models/auth.interface';
import { ActividadResponse } from '../../../../../../core/models/response/actividad-response.model';
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { Fuente } from '../../../../../../core/models/base/fuente.model';

@Component({
  selector: 'activities-table',
  standalone: true,
  imports: [CommonModule, ActivitiesViewEvaluationComponent, PaginatorComponent],
  templateUrl: './activities-table.component.html',
  styleUrl: './activities-table.component.css'
})
export class ActivitiesTableComponent implements OnInit {

  @Input()
  currentUser:UserInfo | null = null;

  public currentPage: number = 1;
  public activities: PagedResponse<ActividadResponse> | null = null;
  public activitiesByType!: ActividadesPorTipoActividad[];
  public headDataTable = ["Actividades", "Autoevaluación", "Fuente 2"]
  public subHeadDataTable = ["Nombre actividad", "Estado", "Acciones", "Evaluador", "Rol Evaluador", "Estado", "Acciones"]
  public openModalViewSelected: boolean = false;
  public activitySelected: ActividadResponse | undefined;
  public sourceSelected: 1 | 2 | undefined;
  public sourceOne: Fuente | null = null;
  public sourceTwo: Fuente | null = null;

  private activitiesServices = inject(ActivitiesServicesService);

  constructor(private toastr: MessagesInfoService) {
    effect(() => {
      this.activities = this.activitiesServices.getDataActivities();
      this.reloadActivities();
    }
    );
  }

  ngOnInit(): void {
    this.getAllActivities(this.currentPage, 10);
  }


  pageChanged(event: any) {
    this.currentPage = event;
    this.getAllActivities(this.currentPage, 10);
  }

  getAllActivities(page: number, totalPage: number) {
    if (this.currentUser) {
      this.activitiesServices.getActivities(this.currentUser.oidUsuario, '', '', '', '', page - 1, totalPage).subscribe({
        next: response => {
          this.activities = response.data;
          this.activitiesServices.setDataActivities(response.data);
          this.reloadActivities();
        },
        error: error => {
          console.error('Error al consultar la información', error);
        }
      });
    }
  }

  public openModalView(activity: ActividadResponse, source: 1 | 2) {
    this.openModalViewSelected = !this.openModalViewSelected;
    this.sourceSelected = source;
    this.activitySelected = activity;
  }

  public closeModalView(event: boolean) {
    this.openModalViewSelected = !event;
  }

  public reloadActivities() {
    if (this.activities && this.activities.content) {
      this.activitiesByType = Object.values(
        this.activities.content.reduce((acc, activity) => {
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

export interface ActividadesPorTipoActividad {
  nombreType: string;
  activities: ActividadResponse[];
}
