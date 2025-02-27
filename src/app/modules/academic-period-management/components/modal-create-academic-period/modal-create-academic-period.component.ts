import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../../shared/services/validators.service';
import { CommonModule } from '@angular/common';
import { AcademicPeriodManagementService } from '../../services/academic-period-management-service.service';
import { MessagesInfoService } from '../../../../shared/services/messages-info.service';
import { PeriodoAcademicoCreate } from '../../../../core/models/modified/periodo-academico-create.model';
declare var bootstrap: any;

@Component({
  selector: 'academic-period-management-modal-create-academic-period',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './modal-create-academic-period.component.html',
  styleUrl: './modal-create-academic-period.component.css'
})
export class ModalCreateAcademicPeriodComponent {

  @Input() currentPage: number = 1;
  @Input() size: number = 1;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);
  private academicPeriodManagementService = inject(AcademicPeriodManagementService);
  private messageInfoService = inject(MessagesInfoService);

  newAcademicPeriodForm: FormGroup = this.formBuilder.group({
    idAcademicPeriod: [null, [Validators.required, this.validatorsService.validateAcademicPeriodFormat]],
    startDate: [null, [Validators.required, this.validatorsService.validateDateRange]],
    endDate: [null, [Validators.required, this.validatorsService.validateDateRange]],
    status: ['activo', [Validators.required]],
  },
    {
      validators: [
        this.validatorsService.validateDateRange()
      ]
    }
  );

  open(): void {
    const myModal = document.getElementById('modal-create-academic-period');
    if (myModal) {
      var bootstrapModal = new bootstrap.Modal(myModal);
      bootstrapModal.show();
    }
  }

  isInvaldField(field: string) {
    const control = this.newAcademicPeriodForm.get(field);
    return control && control.errors && control.invalid && (control.dirty || control.touched);
  }

  hasFieldErrorsForm(controlName: string): boolean {
    const formErrors = this.newAcademicPeriodForm.errors;

    if (!formErrors) {
      return false;
    }

    const dateError = ['invalidDateRange'];

    // Verificar errores en el FormGroup según el control
    switch (controlName) {
      case 'startDate':
        return dateError.some(error => formErrors.hasOwnProperty(error));
      default:
      case 'endDate':
        return dateError.some(error => formErrors.hasOwnProperty(error));

    }
  }

  getFieldError(field: string): string | null {
    if (!this.newAcademicPeriodForm.controls[field]) return null;
    const control = this.newAcademicPeriodForm.controls[field];
    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
        case 'invalidDateRange':
          return 'La fecha de inicio no puede ser mayor a la fecha de fin';
        case 'invalidAcademicPeriodFormat':
          return 'El formato del periodo académico es incorrecto';
        default:
          return null;
      }
    }
    return null;
  }

  getFormError(controlName: string): string | null {
    if (this.newAcademicPeriodForm.errors) {
      const dateError = ['invalidDateRange'];
      switch (controlName) {
        case 'startDate':
          for (const error of dateError) {
            if (this.newAcademicPeriodForm.errors.hasOwnProperty(error)) {
              return 'La fecha de inicio no puede ser mayor a la fecha de fin';
            }
          }
          break;
        case 'endDate':
          for (const error of dateError) {
            if (this.newAcademicPeriodForm.errors.hasOwnProperty(error)) {

              return 'La fecha de inicio no puede ser mayor a la fecha de fin';
            }

          }
          break;
        default:
          return null;
      }
    }
    return null;
  }

  saveNewAcademicPeriod(): void {
    if (this.newAcademicPeriodForm.valid) {
      let newAcademiPeriod: PeriodoAcademicoCreate = {
        idPeriodo: this.newAcademicPeriodForm.get('idAcademicPeriod')?.value,
        fechaInicio: this.newAcademicPeriodForm.get('startDate')?.value,
        fechaFin: this.newAcademicPeriodForm.get('endDate')?.value,
        estadoPeriodoAcademico: {
          oidEstadoPeriodoAcademico: this.newAcademicPeriodForm.get('status')?.value == 'activo' ? 1 : 2
        }
      }
      this.academicPeriodManagementService.saveNewAcademicPeriod(newAcademiPeriod).subscribe({
        next: data => {
          this.messageInfoService.showSuccessMessage('El periodo académico se ha creado correctamente', 'Exito');
          this.recoverAcademicPeriods();
          this.clearFields();
        },
        error: error => {
          this.messageInfoService.showErrorMessage('Error al crear el periodo académico', 'Error');
        }
      });
    }
  }

  recoverAcademicPeriods(): void {
    this.academicPeriodManagementService.getAllAcademicPeriods(this.currentPage - 1, this.size).subscribe((response) => {
      this.academicPeriodManagementService.setAcademicPeriods(response);
    });
  }

  clearFields(): void {
    this.newAcademicPeriodForm.reset();
    this.newAcademicPeriodForm.get('status')?.setValue('activo');
  }
}
