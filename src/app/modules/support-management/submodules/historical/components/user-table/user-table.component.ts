import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { ConsolidadoHistoricoResponse } from '../../../../../../core/models/response/consolidado-historico-response.model';
import { PaginatorComponent } from "../../../../../../shared/components/paginator/paginator.component";
import { PagedResponse } from '../../../../../../core/models/response/paged-response.model';
import { CpdInfoFormComponent } from '../cpd-info-form/cpd-info-form.component';
import { CpdWordGeneratorService } from '../../services/cpd-word-generator.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { HistoricalServices } from '../../services/historical-services.service';
import { UsuarioResponse } from '../../../../../../core/models/response/usuario-response.model';

@Component({
  selector: 'historical-user-table',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent,
    CpdInfoFormComponent
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {

  @ViewChild(CpdInfoFormComponent) cpdInfoFormComponent: CpdInfoFormComponent | null = null;


  private cpdWordGeneratorService = inject(CpdWordGeneratorService);
  private messagesInfoService = inject(MessagesInfoService);
  private historicalServices = inject(HistoricalServices);


  public userSelectedToCreateRelution: ConsolidadoHistoricoResponse | null = null;


  @Input()
  public consolidadoHistoricoResponse: PagedResponse<ConsolidadoHistoricoResponse> | null = null;

  @Input()
  public academicPeriods: { item_id: number; item_text: string }[] = [];

  @Output()
  public pageChange: EventEmitter<number> = new EventEmitter<number>();

  findEvaluationByAcademicPeriod(academicPeriod: number, consolidadoHistorico: ConsolidadoHistoricoResponse): number | null {
    const evaluation = consolidadoHistorico.calificacionesPorPeriodo.find((evaluation) => evaluation.idPeriodoAcademico === academicPeriod);
    return evaluation ? evaluation.calificacion : null;
  }
  public changePage(page: number) {
    this.pageChange.emit(page);
  }


  openAprobeConlidatedModalForm(usuarioSelected: ConsolidadoHistoricoResponse) {
    if (this.cpdInfoFormComponent) {
      this.userSelectedToCreateRelution = usuarioSelected;
      this.cpdInfoFormComponent.open();
    }
  }

  onOptionFormCpdInfo(event: { resolutionNumber: string, resolutionDate: string, oficioNumber: string, oficioDate: string, meetingCouncil: string, councilPresident: string }) {
    if (this.userSelectedToCreateRelution) {
      this.wordGenerator(this.userSelectedToCreateRelution, event);
    }
  }

  public getAverageEvaluation(consolidadoHistorico: ConsolidadoHistoricoResponse): number {
    const evaluations = consolidadoHistorico.calificacionesPorPeriodo.map((evaluation) => evaluation.calificacion);
    const total = evaluations.reduce((acc, curr) => acc + curr, 0);
    return evaluations.length > 0 ? total / evaluations.length : 0;
  }

  wordGenerator(
    teacherInfo: ConsolidadoHistoricoResponse,
    infoConsolidated: { resolutionNumber: string, resolutionDate: string, oficioNumber: string, oficioDate: string, meetingCouncil: string, councilPresident: string }
  ) {
    let infoTeacherConsolidated: UsuarioResponse | null =
      null;
    this.historicalServices
      .getUserById(teacherInfo.oidUsuario)
      .subscribe({
        next: (response) => {
          infoTeacherConsolidated = response.data;
          this.cpdInfoFormComponent?.close();
          this.cpdWordGeneratorService.generateWordDocument(
            infoTeacherConsolidated,
            this.getAverageEvaluation(teacherInfo),
            infoConsolidated)
          this.messagesInfoService.showSuccessMessage(
            'Documento generado correctamente', 'Éxito'
          );
        },
        error: (error) => {
          this.messagesInfoService.showErrorMessage(
            'Error al obtener la información del docente',
            'Error'
          );
        },
      });
  }

}
