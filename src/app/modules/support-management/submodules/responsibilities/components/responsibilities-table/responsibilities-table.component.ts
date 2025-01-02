import { Component, effect } from '@angular/core';
import { ResponsabilityResponse, ResponsabilidadesPorTipoActividad, Responsability } from '../../../../../../core/models/responsibilitie.interface';
import { CommonModule } from '@angular/common';
import { ResponsibilitiesUploadEvaluationComponent } from "../responsibilities-upload-evaluation/responsibilities-upload-evaluation.component";
import { ResponsibilitiesViewEvaluationComponent } from "../responsibilities-view-evaluation/responsibilities-view-evaluation.component";
import { ResponsibilitiesEditEvaluationComponent } from "../responsibilities-edit-evaluation/responsibilities-edit-evaluation.component";
import { ResponsibilitiesServicesService } from '../../services/responsibilities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { PaginatorComponent } from "../../../../../../shared/components/paginator/paginator.component";

@Component({
  selector: 'responsibilities-table',
  standalone: true,
  imports: [
    CommonModule,
    ResponsibilitiesUploadEvaluationComponent,
    ResponsibilitiesViewEvaluationComponent,
    ResponsibilitiesEditEvaluationComponent,
    PaginatorComponent
],
  templateUrl: './responsibilities-table.component.html',
  styleUrl: './responsibilities-table.component.css'
})
export class ResponsibilitiesTableComponent {

  public currentPage: number = 1;
  public headDataTable = ["Actividad", "Fuente 2", "Informe"];
  public headDataTableCoodinator = ["Actividad", "Fuente", "Informe"];
  public subHeadDataTableCoorinator = ["Nombre actividad", "Evaluado", "Rol evaluado", "Estado soporte", "Acciones", "Acciones"];
  public subHeadDataTableStudents = ["Nombre actividad", "Evaluado", "Rol evaluado", "Estado soporte", "Acciones","Acciones"];

  public responsabilitieByType: ResponsabilidadesPorTipoActividad[] = [];
  public responsabilities: ResponsabilityResponse | null = null;

  public openModalResposabilitySelected: boolean = false;
  public resposabilitySelected: Responsability | undefined;

  public openModalViewSelected: boolean = false;

  public openModalEditSelected: boolean = false;

  constructor(private service: ResponsibilitiesServicesService,  private toastr: MessagesInfoService) { 
    effect(() => {
      this.responsabilities = this.service.getResponsibilitiesData();
      this.reloadActivities();
    });
  }

  ngOnInit(): void {
    this.recoverResponsabilities(this.currentPage, 10);
  }

  recoverResponsabilities(page: number, totalPage: number) {
    this.service.getResponsibilities('4', '', '', '', '',page-1, totalPage).subscribe({
      next: data => {
        this.service.setResponsibilitiesData(data);
      },
      error: error => {
        this.toastr.showErrorMessage('Error al consultar la información', 'Error');
      }
    });
  }


  public openModalUpload(responsability: Responsability) {
    this.openModalResposabilitySelected = !this.openModalResposabilitySelected;
    this.resposabilitySelected = responsability;
  }

  public closeModalUpload(event: boolean) {
    this.openModalResposabilitySelected = !event;
  }

  public openModalView(responsability: Responsability) {
    this.openModalViewSelected = !this.openModalViewSelected;
    this.resposabilitySelected = responsability;
  }

  public openModalEdit(responsability: Responsability) {
    this.openModalEditSelected = !this.openModalEditSelected;
    this.resposabilitySelected = responsability;
  }

  public closeModalView(event: boolean) {
    this.openModalViewSelected = !event;
  }

  public closeModalEdit(event: boolean) {
    this.openModalEditSelected = !event
  }

  public downloadReport(responsability: Responsability) {
    this.service.getDownloadReportFile(responsability.fuentes[0].oidFuente, true).subscribe(
      {
        next: blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = responsability.fuentes[0].nombreDocumentoInforme;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error: error => {
          this.toastr.showErrorMessage('Error al consultar la información', 'Error');
        }
      });
  }


  public reloadActivities() {
    if(this.responsabilities) {
      this.responsabilitieByType = Object.values(
        this.responsabilities.content.reduce((acc, responsability) => {
          const tipoNombre = responsability.tipoActividad.nombre;
  
          // Si el tipo de actividad no existe como clave, la inicializamos
          if (!acc[tipoNombre]) {
            acc[tipoNombre] = {
              nombreType: tipoNombre,
              activities: []
            };
          }
  
          // Añadimos la actividad al grupo correspondiente
          acc[tipoNombre].activities.push(responsability);
  
          return acc;
        }, {} as { [key: string]: ResponsabilidadesPorTipoActividad })
      );
    }
    }
}
