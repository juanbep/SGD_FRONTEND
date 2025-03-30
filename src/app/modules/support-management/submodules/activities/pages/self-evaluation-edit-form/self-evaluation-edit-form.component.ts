import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ActivitiesServicesService } from '../../services/activities-services.service';
import { MessagesInfoService } from '../../../../../../shared/services/messages-info.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SelfEvaluationPdfGeneratorService } from '../../services/self-evaluation-pdf-generator.service';
import { ValidatorsService } from '../../../../../../shared/services/validators.service';
import { FuenteAutoevaluacion, OdsSeleccionado } from '../../../../../../core/models/modified/fuente-autoevaluacion.model';

@Component({
  selector: 'app-self-evaluation-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './self-evaluation-edit-form.component.html',
  styleUrls: []
})
export class SelfEvaluationEditFormComponent implements OnInit {

  private formBuilder: FormBuilder = inject(FormBuilder);
  private activitiesService = inject(ActivitiesServicesService);
  private messagesInfoService = inject(MessagesInfoService);
  private activatedRoute = inject(ActivatedRoute);
  private selfEvaluationPdfGeneratorService = inject(SelfEvaluationPdfGeneratorService);
  private validatorService = inject(ValidatorsService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private router: Router = inject(Router);

  public pdfUrl: SafeResourceUrl | null = null;
  public formPdf: File | null = null;
  public evidences: File[] = [];
  public signatureFile: File | null = null;

  editSelfEvaluationForm: FormGroup = this.formBuilder.group({
    activityDescription: [null, [Validators.required]],
    results: this.formBuilder.array([ this.createResultEntry() ]),
    lessonsLearned: this.formBuilder.array([ this.createLessonEntry() ]),
    improvementOpportunities: this.formBuilder.array([ this.createOpportunityEntry() ]),
    evaluation: [
      null,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ],
    ],
    observation: [null],
    signature: [null, [Validators.required]],
  });

  // Métodos para construir cada FormGroup de los arrays reutilizando el patrón del self evaluation
  createResultEntry(): FormGroup {
    return this.formBuilder.group({
      oidResult: [null],
      result: [null, Validators.required],
      ODS: [null, Validators.required],
      evidence: [null]
    });
  }
  createLessonEntry(): FormGroup {
    return this.formBuilder.group({
      oidLesson: [null],
      lesson: [null]
    });
  }
  createOpportunityEntry(): FormGroup {
    return this.formBuilder.group({
      oidOpportunity: [null],
      opportunity: [null]
    });
  }

  get results(): FormArray {
    return this.editSelfEvaluationForm.get('results') as FormArray;
  }
  get lessonsLearnedArray(): FormArray {
    return this.editSelfEvaluationForm.get('lessonsLearned') as FormArray;
  }
  get improvementOpportunitiesArray(): FormArray {
    return this.editSelfEvaluationForm.get('improvementOpportunities') as FormArray;
  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.loadSelfEvaluation(id);
  }

  // Se asume que existe un método en activitiesService para cargar la autoevaluación guardada
  loadSelfEvaluation(id: number) {
    this.activitiesService.getActivityByIdForm(id).subscribe({
      next: (data) => {
        const activity = data.data;
        // Parchear el formulario con los valores existentes
        this.editSelfEvaluationForm.patchValue({
          activityDescription: activity.Descripcion,
          evaluation: Number(activity.Fuente.calificacion),
          observation: activity.Fuente.observacion,
        });
        // Para arrays se reconstruye el FormArray; se asume que data.odsSeleccionados es un arreglo
        this.results.clear();
        activity.odsSeleccionados.forEach((ods) => {
          const group = this.createResultEntry();
          group.patchValue({
            oidResult: ods.oidAutoevaluacionOds,
            result: ods.resultado,
            ODS: ods.oidOds,
            evidence: ods.documento || null
          });
          this.results.push(group);
        });
        // Si existen lecciones y oportunidades, parchearlas de forma similar
        this.lessonsLearnedArray.clear();
        if (activity.leccionesAprendidas) {
          activity.leccionesAprendidas.forEach((lesson: any) => {
            const group = this.createLessonEntry();
            group.patchValue({ lesson: lesson.descripcion, oidLesson: lesson.oidLeccionAprendida });
            this.lessonsLearnedArray.push(group);
          });
        }
        this.improvementOpportunitiesArray.clear();
        if (activity['oportunidadesMejora']) {
          activity['oportunidadesMejora'].forEach((opp: any) => {
            const group = this.createOpportunityEntry();
            group.patchValue({ opportunity: opp.descripcion, oidOpportunity: opp.oidOportunidadMejora });
            this.improvementOpportunitiesArray.push(group);
          });
        }
      },
      error: (error) => {
        this.messagesInfoService.showErrorMessage(error.error.mensaje, 'Error');
      }
    });
  }

  addResultEntry() {
    if (this.results.length < 10) {
      this.results.push(this.createResultEntry());
    }
  }
  removeResultEntry(index: number) {
    this.results.removeAt(index);
  }
  addLessonEntry() {
    if (this.lessonsLearnedArray.length < 10) {
      this.lessonsLearnedArray.push(this.createLessonEntry());
    }
  }
  removeLessonEntry(index: number) {
    this.lessonsLearnedArray.removeAt(index);
  }
  addOpportunityEntry() {
    if (this.improvementOpportunitiesArray.length < 10) {
      this.improvementOpportunitiesArray.push(this.createOpportunityEntry());
    }
  }
  removeOpportunityEntry(index: number) {
    this.improvementOpportunitiesArray.removeAt(index);
  }

  triggersSignatureUpload() {
    const fileUpload = document.getElementById('signature') as HTMLInputElement;
    if (fileUpload) {
      fileUpload.click();
    }
  }

  onSignatureSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.signatureFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.editSelfEvaluationForm.get('signature')?.setValue(reader.result);
      };
      reader.readAsDataURL(this.signatureFile);
    }
  }

  triggersEvidences(elementId: string) {
    const fileUpload = document.getElementById(elementId) as HTMLInputElement;
    if (fileUpload) {
      fileUpload.click();
    }
  }

  onEvidenceSelected(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.evidences[index] = input.files[0];
    }
  }

  generatePdfPreview() {
    const pdfResult = this.selfEvaluationPdfGeneratorService.generatePdfDocument(
      this.editSelfEvaluationForm.value,
      {}
    );
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfResult.base64);
    this.formPdf = pdfResult.file;
  }

  onSubmit() {
    if (this.editSelfEvaluationForm.invalid) {
      this.editSelfEvaluationForm.markAllAsTouched();
      this.messagesInfoService.showWarningMessage('Complete todos los campos requeridos', 'Advertencia');
      return;
    }
    const autoevaluacion: FuenteAutoevaluacion = {
      oidFuente: this.activatedRoute.snapshot.params['id'],
      tipoCalificacion: 'EN_LINEA',
      calificacion: Number(this.editSelfEvaluationForm.get('evaluation')?.value),
      descripcion: this.editSelfEvaluationForm.get('activityDescription')?.value,
      observacion: this.editSelfEvaluationForm.get('observation')?.value,
      odsSeleccionados: this.editSelfEvaluationForm.get('results')?.value.map((result: any) => {
        return {
          oidAutoevaluacionOds: result.oidResult,
          oidOds: Number(result.ODS),
          resultado: result.result,
          documento: ''
        } as OdsSeleccionado;
      }),
      leccionesAprendidas: this.editSelfEvaluationForm.get('lessonsLearned')?.value.map((l: any) => ({ oidLeccionAprendida: l.oidLesson, descripcion: l.lesson })),
      oportunidadesMejora: this.editSelfEvaluationForm.get('improvementOpportunities')?.value.map((opp: any) => ({ oidOportunidadMejora: opp.oidOpportunity, descripcion: opp.opportunity })),
    };

    autoevaluacion.odsSeleccionados.forEach((ods, index) => {
      if (this.evidences[index]) {
        ods.documento = this.evidences[index].name;
      }
    });
    this.generatePdfPreview();
    this.activitiesService.saveSelfAssessmentByForm(autoevaluacion, this.evidences, this.signatureFile!, this.formPdf!).subscribe({
      next: (response) => {
        this.messagesInfoService.showSuccessMessage('Autoevaluación actualizada correctamente', 'Éxito');
        this.router.navigate(['./app/gestion-soportes/actividades/']);
      },
      error: (error) => {
        this.messagesInfoService.showErrorMessage(error.error.mensaje, 'Error');
      }
    });
  }

  isInvalidField(field: string) {
    const control = this.editSelfEvaluationForm.get(field);
    return (
      control &&
      control.errors &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  getFieldError(field: string): string | null {
    const control = this.editSelfEvaluationForm.get(field);
    const errors = control?.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'min':
          return 'El valor mínimo es 0';
        case 'max':
          return 'El valor máximo es 100';
        case 'invalidNumber':
          return 'El valor debe ser numérico';
        default:
          return null;
      }
    }
    return null;
  }

  deleteEvidenceFile(index: number) {
    this.evidences.splice(index, 1);
  this.editSelfEvaluationForm.get("results."+index+".evidence")? this.editSelfEvaluationForm.get("results."+index+".evidence")?.setValue(null) : null;
  }

  downloadEvidenceFile(index: number) {
    const evidence = this.evidences[index];
    if (evidence) {
      const url = URL.createObjectURL(evidence);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = evidence.name;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  deleteSignatureFile() {
    this.signatureFile = null;
    this.editSelfEvaluationForm.get('signature')?.setValue(null);
  }

  downloadSignatureFile() {
    const signature = this.signatureFile;
    if (signature) {
      const url = URL.createObjectURL(signature);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = signature.name;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  goBack() {
    this.router.navigate(['./app/gestion-soportes/actividades/']);
  }


}