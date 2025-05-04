import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { UsuarioResponse } from '../../../../core/models/response/usuario-response.model';
import { AcademicPeriodManagementService } from '../../services/academic-period-management-service.service';
import { DEPARTAMENTOS, ROLES } from '../../../../core/enums/domain-enums';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'modal-confirm-get-info-kira',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './modal-confirm-get-info-kira.component.html',
  styleUrl: './modal-confirm-get-info-kira.component.css'
})
export class ModalConfirmGetInfoKiraComponent implements OnInit {

  @Output()
  confirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  private academicPeriodManagementService = inject(AcademicPeriodManagementService);
  private formBuilder: FormBuilder = inject(FormBuilder);


  public bossDepartament: UsuarioResponse[] = [];
  public decano: UsuarioResponse[] = [];
  public departmentWithoutBoss: string[] = [];

  form: FormGroup = this.formBuilder.group({
    checkbox1: [false, [Validators.required, Validators.requiredTrue]],
    checkbox2: [false, [Validators.required, Validators.requiredTrue]],
    checkbox3: [false, [Validators.required, Validators.requiredTrue]],
    checkbox4: [false, [Validators.required, Validators.requiredTrue]],
    checkbox5: [false, [Validators.required, Validators.requiredTrue]],
  });

  ngOnInit(): void {

  }

  recoverActiveBossDepartament() {
    this.academicPeriodManagementService.getUsersByParams(0, 10, null, null, null, null, null, null, null, null, ROLES.JEFE_DE_DEPARTAMENTO.toString(), '1').subscribe({
      next: (response) => {
        this.bossDepartament = response.data.content || [];
        this.validateWithBoosDepartmentDoesNotExist();

      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  recoverActiveDecano() {
    this.academicPeriodManagementService.getUsersByParams(0, 10, null, null, null, null, null, null, null, null, ROLES.DECANO.toString(), '1').subscribe({
      next: (response) => {
        this.decano = response.data.content || [];

      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  validateWithBoosDepartmentDoesNotExist() {
    if (!this.bossDepartament.find((boss) => boss.usuarioDetalle.departamento === DEPARTAMENTOS.TELEMATICA)) {
      this.departmentWithoutBoss.push(DEPARTAMENTOS.TELEMATICA);
    }
    if (!this.bossDepartament.find((boss) => boss.usuarioDetalle.departamento === DEPARTAMENTOS.TELECOMUNICACIONES)) {
      this.departmentWithoutBoss.push(DEPARTAMENTOS.TELECOMUNICACIONES);
    }
    if (!this.bossDepartament.find((boss) => boss.usuarioDetalle.departamento === DEPARTAMENTOS.ELECTRONICA_INSTRUMENTACION_Y_CONTROL)) {
      this.departmentWithoutBoss.push(DEPARTAMENTOS.ELECTRONICA_INSTRUMENTACION_Y_CONTROL);
    }
    if (!this.bossDepartament.find((boss) => boss.usuarioDetalle.departamento === DEPARTAMENTOS.SISTEMAS)) {
      this.departmentWithoutBoss.push(DEPARTAMENTOS.SISTEMAS);
    }
  }

  isFormValid(): boolean {
    return this.form.valid && this.form.get('checkbox1')?.value && this.form.get('checkbox2')?.value && this.form.get('checkbox3')?.value && this.form.get('checkbox4')?.value && this.form.get('checkbox5')?.value;
  }

  open() {
    const modal = new bootstrap.Modal(document.getElementById('modal-confirm-dialog-kira'));
    if (modal) {
      this.recoverActiveBossDepartament();
      this.recoverActiveDecano();
      modal.show();
      
    }
  }

  onConfirm() {
    this.confirm.emit(true);
  }

  close() {
    const modal = new bootstrap.Modal(document.getElementById('modal-confirm-dialog'));
    if (modal) {
      modal.hide();
    }
  }
}
