import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SupportManagementResponsabilitiesService } from '../../services/support-management-responabilities.service';
import { Responsabilidad, ResponsabilidadesPorTipoActividad } from '../../../../core/responsabilitie.interface';
import { UploadResponsabilitiesFileComponent } from '../upload-responsabilities-file/upload-responsabilities-file.component';
import { DownloadFileComponent } from "../download-file/download-file.component";
import { EditAssessmentComponent } from "../edit-assessment/edit-assessment.component";

@Component({
  selector: 'support-management-table-activities-responsabilities',
  standalone: true,
  imports: [CommonModule, UploadResponsabilitiesFileComponent, DownloadFileComponent, EditAssessmentComponent],
  templateUrl: './table-activities-responsabilities.component.html',
  styleUrl: './table-activities-responsabilities.component.css'
})
export class TableActivitiesResponsabilitiesComponent implements OnInit {

  public headDataTable = ["Actividad", "Fuente 2"];
  public headDataTableCoodinator = ["Actividad", "Fuente", "Informe"];
  public subHeadDataTableCoorinator = ["Nombre actividad", "Evaluado", "Rol evaluado", "Estado soporte", "Acciones", "Acciones"];
  public subHeadDataTableStudents = ["Nombre actividad", "Evaluado", "Rol evaluado", "Estado soporte", "Acciones"];

  public responsabilitieByType: ResponsabilidadesPorTipoActividad[] = [];
  public responsabilities: Responsabilidad[] = [];

  public openModalResposabilitySelected: boolean = false;
  public resposabilitySelected: Responsabilidad | undefined;

  public openModalViewSelected: boolean = false;

  public openModalEditSelected: boolean = false;

  constructor(private service: SupportManagementResponsabilitiesService) { }

  ngOnInit(): void {
    this.service.allResponsabilitiesByUser('4');
    this.service.getDataResponsabilities().subscribe(data => {
      this.responsabilities = data;
      if (this.responsabilities.length > 0) {
        this.reloadActivities();
        console.log(this.responsabilitieByType);

      }
    })

  }

  public openModalUpload(responsability: Responsabilidad) {
    this.openModalResposabilitySelected = !this.openModalResposabilitySelected;
    this.resposabilitySelected = responsability;
  }

  public closeModalUpload(event: boolean) {
    this.openModalResposabilitySelected = !event;
  }

  public openModalView(responsability: Responsabilidad) {
    this.openModalViewSelected = !this.openModalViewSelected;
    this.resposabilitySelected = responsability;
  }

  public openModalEdit(responsability: Responsabilidad) {
    this.openModalEditSelected = !this.openModalEditSelected;
    this.resposabilitySelected = responsability;
  }

  public closeModalView(event: boolean) {
    this.openModalViewSelected = !event;
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
