import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'modal-reponsibilities-view-evaluation-form',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './reponsibilities-view-evaluation-form.component.html',
  styleUrl: './reponsibilities-view-evaluation-form.component.css'
})
export class ReponsibilitiesViewEvaluationFormComponent {



  open(){
    var myModal = new bootstrap.Modal(document.getElementById('responsibilities-view-evaluation-form-modal'), {
      keyboard: false
    });
    myModal.show();
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


}
