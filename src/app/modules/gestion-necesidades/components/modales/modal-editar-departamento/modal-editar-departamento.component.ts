import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { UpdateMateriaDto } from '../../../../gestion-planes/models';
import { DepartamentoHelperService } from '../../../../gestion-planes/services';
import { MateriaService } from '../../../../gestion-planes/services/materia/materia.service';
import { ToastrService } from 'ngx-toastr';
import { NecesidadResponse } from '../../../models';

@Component({
  selector: 'app-modal-editar-departamento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './modal-editar-departamento.component.html',
  styleUrl: './modal-editar-departamento.component.css',
})
export class ModalEditarDepartamentoComponent implements OnInit {
  // ===== INPUTS =====
  @Input() necesidad!: NecesidadResponse;
  @Input() visible = false;

  // ===== OUTPUTS =====
  @Output() onCerrar = new EventEmitter<void>();
  @Output() onDepartamentoActualizado = new EventEmitter<void>();

  // ===== SERVICIOS =====
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private departamentoHelper = inject(DepartamentoHelperService);
  private materiaService = inject(MateriaService);

  // ===== ESTADO =====
  departamentoForm!: FormGroup;
  guardando = false;
  loadingDepartamentos = false;
  departamentos: { value: number; label: string; facultad: string }[] = [];

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarDepartamentos();
  }

  inicializarFormulario(): void {
    this.departamentoForm = this.fb.group({
      oidDepartamento: [
        this.necesidad.materia?.oidDepartamento,
        [Validators.required],
      ],
    });
  }

  async cargarDepartamentos(): Promise<void> {
    this.loadingDepartamentos = true;
    this.departamentoForm.get('oidDepartamento')?.disable();

    try {
      this.departamentos = await this.departamentoHelper.getAllForDropdown();

      if (this.departamentos.length === 0) {
        this.toastr.warning(
          'No se encontraron departamentos disponibles',
          'Sin departamentos'
        );
      }
    } catch (error) {
      console.error('Error al cargar departamentos:', error);
      this.toastr.error('No se pudieron cargar los departamentos', 'Error');
      this.departamentos = [];
    } finally {
      this.loadingDepartamentos = false;
      this.departamentoForm.get('oidDepartamento')?.enable();
    }
  }

  async confirmar(): Promise<void> {
    if (this.departamentoForm.invalid) {
      this.toastr.warning(
        'Por favor, seleccione un departamento',
        'Campo requerido'
      );
      return;
    }

    const nuevoOidDepartamento =
      this.departamentoForm.get('oidDepartamento')?.value;
    const materia = this.necesidad.materia;

    // Validar que el departamento haya cambiado
    if (nuevoOidDepartamento === materia.oidDepartamento) {
      this.toastr.info(
        'No se realizaron cambios en el departamento',
        'Sin cambios'
      );
      this.cerrar();
      return;
    }

    this.guardando = true;

    try {
      // Construir el DTO con TODOS los campos de la materia, cambiando solo el departamento
      const updateDto: UpdateMateriaDto = {
        idMateria: materia.idMateria,
        oidMateria: materia.oidMateria,
        codigo: materia.codigo,
        nombre: materia.nombre,
        semestre: materia.semestre,
        horasSemana: materia.horasSemana,
        oidDepartamento: nuevoOidDepartamento, // ← ÚNICO CAMPO MODIFICADO
        oidPlan: materia.oidPlan,
        idCorrequisito: materia.idCorrequisito,
      };

      await new Promise((resolve, reject) => {
        this.materiaService.updateMateria(updateDto).subscribe({
          next: (response) => resolve(response),
          error: (error) => reject(error),
        });
      });

      // Obtener el nombre del nuevo departamento
      const nuevoDepartamento = this.departamentos.find(
        (d) => d.value === nuevoOidDepartamento
      );
      const nombreDepartamento =
        nuevoDepartamento?.label || 'departamento seleccionado';

      this.toastr.success(
        `Departamento de "${materia.nombre}" actualizado a "${nombreDepartamento}"`,
        'Actualización exitosa'
      );

      this.onDepartamentoActualizado.emit();
      this.cerrar();
    } catch (error: any) {
      console.error('Error al actualizar departamento:', error);
      const mensajeError =
        error?.error?.mensaje ||
        error?.message ||
        'Error al actualizar el departamento';
      this.toastr.error(mensajeError, 'Error');
    } finally {
      this.guardando = false;
    }
  }

  cerrar(): void {
    if (!this.guardando) {
      this.onCerrar.emit();
    }
  }

  // ===== GETTERS PARA EL TEMPLATE =====
  get departamentoActual(): string {
    return this.necesidad.materia?.nombreDepartamento || 'Sin asignar';
  }

  get tieneDepartamento(): boolean {
    return !!this.necesidad.materia?.oidDepartamento;
  }

  get departamentoInvalid(): boolean {
    const control = this.departamentoForm.get('oidDepartamento');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
