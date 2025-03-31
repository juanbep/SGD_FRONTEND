import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { FuenteDocenteFormularioResponse } from '../../../../../../core/models/response/fuente-docente-formulario-response.model';
import { CommonModule } from '@angular/common';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
declare var bootstrap: any;

@Component({
  selector: 'self-evaluation-review-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './self-evaluation-review-modal.component.html',
  styleUrls: ['./self-evaluation-review-modal.component.css'],
})
export class SelfEvaluationReviewModalComponent {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private activitiesServices: ActivitiesServicesService = inject(
    ActivitiesServicesService
  );
  private messagesInforService: MessagesInfoService =
    inject(MessagesInfoService);

  public selfEvaluation: FuenteDocenteFormularioResponse | null = null;

  evaluationForm: FormGroup = this.formBuilder.group({
    activityDescription: [null],
    results: this.formBuilder.array([this.createResultEntry()]),
    lessonsLearned: this.formBuilder.array([this.createLessonEntry()]),
    improvementOpportunities: this.formBuilder.array([
      this.createOpportunityEntry(),
    ]),
    evaluation: [null],
    observation: [null],
    signature: [null],
  });

  openModal(idSource: number) {
    const modalElem = document.getElementById('self-evaluation-review-modal');
    if (modalElem) {
      const modal = new bootstrap.Modal(modalElem, { keyboard: false });
      modal.show();
      this.recoverSource(idSource);
    }
  }
  // Métodos para resultados existentes...
  createResultEntry(): FormGroup {
    return this.formBuilder.group({
      result: [null],
      ODS: [null],
      evidence: [null],
    });
  }

  // Nuevos métodos para lecciones aprendidas
  createLessonEntry(): FormGroup {
    return this.formBuilder.group({
      lesson: [null],
    });
  }

  createOpportunityEntry(): FormGroup {
    return this.formBuilder.group({
      opportunity: [null],
    });
  }

  recoverSource(idSource: number) {
    this.activitiesServices.getActivityByIdForm(idSource).subscribe({
      next: (response) => {
        this.selfEvaluation = response.data;
        this.populateForm();
      },
      error: (error) => {
        this.messagesInforService.showErrorMessage(
          error.errro.mensaje,
          'Error'
        );
      },
    });
  }

  downloadSupportFile() {
    if (this.selfEvaluation) {
      this.activitiesServices
        .getDownloadSourceFile(this.selfEvaluation.Fuente.oidFuente)
        .subscribe({
          next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download =
              this.selfEvaluation?.Fuente.nombreArchivo || 'fuente.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          },
          error: (error) => {
            this.messagesInforService.showErrorMessage(
              error.errro.mensaje,
              'Error'
            );
          },
        });
    }
  }

  downloadEvidenceFile(idResult: number | null, index: number) {
    if(!idResult) return;
    this.activitiesServices.getEvidenceResultOdsFile(idResult).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.selfEvaluation?.odsSeleccionados[index].documento|| 'evidencia';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.messagesInforService.showErrorMessage(
          error.errro.mensaje,
          'Error'
        );
      },
    });
  }

  populateForm() {
    if (this.selfEvaluation) {
      (this.evaluationForm.get('results') as FormArray).clear();
      this.selfEvaluation.odsSeleccionados.forEach((result) => {
        (this.evaluationForm.get('results') as FormArray).push(
          this.formBuilder.group({
            result: [result.resultado],
            ODS: [result.nombre],
            evidence: [result.documento],
          })
        );
      });

      (this.evaluationForm.get('lessonsLearned') as FormArray).clear();
      this.selfEvaluation.leccionesAprendidas.forEach((lesson) => {
        (this.evaluationForm.get('lessonsLearned') as FormArray).push(
          this.formBuilder.group({
            lesson: [lesson.descripcion],
          })
        );
      });

      (
        this.evaluationForm.get('improvementOpportunities') as FormArray
      ).clear();
      this.selfEvaluation.oportunidadesMejora.forEach((opportunity) => {
        (this.evaluationForm.get('improvementOpportunities') as FormArray).push(
          this.formBuilder.group({
            opportunity: [opportunity.descripcion],
          })
        );
      });

      this.evaluationForm.patchValue({
        activityDescription: this.selfEvaluation.Descripcion,
        evaluation: this.selfEvaluation.Fuente.calificacion,
        observation: this.selfEvaluation.Fuente.observacion,
      });
    }
  }
}
