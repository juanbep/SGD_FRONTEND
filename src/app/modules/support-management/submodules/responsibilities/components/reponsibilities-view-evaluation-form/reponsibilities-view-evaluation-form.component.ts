import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ResponsibilitiesServicesService } from '../../services/responsibilities-services.service';
import { FuenteEstudianteFormularioResponse } from '../../../../../../core/models/response/fuente-estudiante-formulario-response.model';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { ESTADO_ETAPA_DESARROLLO } from '../../../../../../core/enums/domain-enums';
declare var bootstrap: any;
@Component({
  selector: 'modal-reponsibilities-view-evaluation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reponsibilities-view-evaluation-form.component.html',
  styleUrl: './reponsibilities-view-evaluation-form.component.css',
})
export class ReponsibilitiesViewEvaluationFormComponent {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private responsibilitiesService = inject(ResponsibilitiesServicesService);
  private messagesInfoService = inject(MessagesInfoService);

  public selectedFiles: {
    signature: File | null;
    reportDocument: File | null;
  } = { signature: null, reportDocument: null };

  formEvaluation: FormGroup = this.formBuilder.group({
    degreeWorkTitle: [null, [Validators.required]],
    developmentStage: [null, [Validators.required]],
    qualification_1: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
    qualification_2: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
    qualification_3: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
    qualification_4: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
    qualification_5: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
    qualification_6: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
    qualification_7: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
    qualification_8: [
      '',
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
        Validators.pattern('^[0-9]+$'),
      ],
    ],
    observations: [''],
    studentSignature: ['', [Validators.required]],
  });

  public responsibility: FuenteEstudianteFormularioResponse | null = null;
  public totalAverage: number | null = null;

  open(idSource: number) {
    var myModal = new bootstrap.Modal(
      document.getElementById('responsibilities-view-evaluation-form-modal'),
      {
        keyboard: false,
      }
    );
    myModal.show();
    this.loadResponsibility(idSource);
  }

  loadResponsibility(id: number) {
    if (id) {
      this.responsibilitiesService.getInfoResponsibilityByForm(id).subscribe({
        next: (resp) => {
          this.responsibility = resp.data;
          this.patchForm();
        },
        error: (err) => {
          this.messagesInfoService.showErrorMessage(err.error.mensaje, 'Error');
        },
      });
    }
  }

  recoverResponsibility() {}

  patchForm() {
    // Se asume que la fuente a editar es la segunda (índice 1) del arreglo 'fuentes'
    this.formEvaluation.patchValue({
      degreeWorkTitle: this.responsibility?.encuesta.nombre,
      developmentStage: this.responsibility?.estadoEtapaDesarrollo.nombre,
      qualification_1:
        this.responsibility?.preguntas[0]?.respuesta.toString() || '',
      qualification_2:
        this.responsibility?.preguntas[1]?.respuesta.toString() || '',
      qualification_3:
        this.responsibility?.preguntas[2]?.respuesta.toString() || '',
      qualification_4:
        this.responsibility?.preguntas[3]?.respuesta.toString() || '',
      qualification_5:
        this.responsibility?.preguntas[4]?.respuesta.toString() || '',
      qualification_6:
        this.responsibility?.preguntas[5]?.respuesta.toString() || '',
      qualification_7:
        this.responsibility?.preguntas[6]?.respuesta.toString() || '',
      qualification_8:
        this.responsibility?.preguntas[7]?.respuesta.toString() || '',
      observations: this.responsibility?.observacion || '',
    });
    this.computeAverage();
  }

  qualitativeEquivalent(evaluation: string | null) {
    if (evaluation === null || evaluation === '') {
      return '';
    }
    const evaluationNumber = Number(evaluation);
    if (evaluationNumber >= 0 && evaluationNumber < 70) {
      return 'Deficiente';
    }
    if (evaluationNumber >= 70 && evaluationNumber < 80) {
      return 'Aceptable';
    }
    if (evaluationNumber >= 80 && evaluationNumber < 90) {
      return 'Bueno';
    }
    if (evaluationNumber >= 90 && evaluationNumber <= 100) {
      return 'Sobresaliente';
    }
    return '';
  }

  computeAverage() {
    const fields = [
      'qualification_1',
      'qualification_2',
      'qualification_3',
      'qualification_4',
      'qualification_5',
      'qualification_6',
      'qualification_7',
      'qualification_8',
    ];
    const values = fields.map((f) => Number(this.formEvaluation.get(f)?.value));
    const sum = values.reduce((a, b) => a + b, 0);
    this.totalAverage = sum / fields.length;
  }

  recoverSupportFile() {
    if (this.responsibility?.oidFuente) {
      this.responsibilitiesService
        .getdownloadSourceFile(this.responsibility?.oidFuente)
        .subscribe({
          next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'fuente.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          },
          error: (err) => {
            this.messagesInfoService.showErrorMessage(
              err.error.mensaje,
              'Error'
            );
          },
        });
    }
  }
}
