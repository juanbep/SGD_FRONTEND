import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ConsolidadoHistoricoResponse } from '../../../../../../core/models/response/consolidado-historico-response.model';

@Component({
  selector: 'historical-user-table',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent {
  @Input() 
  public consolidadoHistoricoResponse: ConsolidadoHistoricoResponse[] = [];

  @Input()
  public AcademicPeriods: { item_id: number; item_text: string }[] = [];


  findEvaluationByAcademicPeriod(academicPeriod: number, consolidadoHistorico: ConsolidadoHistoricoResponse): number | null {
    const evaluation = consolidadoHistorico.calificacionesPorPeriodo.find((evaluation) => evaluation.idPeriodoAcademico === academicPeriod);
    return evaluation ? evaluation.calificacion : null;
  }
}
