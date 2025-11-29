import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  ActividadResponse,
  CreateAtributoDTO,
  UpdateActividadDTO,
} from '../../../models';
import { ESTADOS_ACTIVIDAD_DROPDOWN } from '../../../utils/actividad-utils';

@Component({
  selector: 'app-modal-editar-actividad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './modal-editar-actividad.component.html',
  styleUrl: './modal-editar-actividad.component.css',
})
export class ModalEditarActividadComponent implements OnChanges {
  @Input() visible = false;
  @Input() actividad!: ActividadResponse;
  //@Input() calendariosDropdown: { value: number; label: string }[] = [];
  //@Input() tiposActividadDropdown: { value: number; label: string }[] = [];
  //@Input() estadosDropdown: { value: number | string; label: string }[] = [];
  //@Input() cargosDropdown: { value: number | string; label: string }[] = [];

  @Output() onCerrar = new EventEmitter<void>();
  @Output() onGuardar = new EventEmitter<UpdateActividadDTO>();

  private fb = inject(FormBuilder);

  // ========== CONFIGURACIÓN DE CAMPOS EDITABLES ==========
  camposEditables = {
    nombreActividad: true,
    tipoActividad: false,
    calendario: false,
    estado: true,
    semanas: true,
    atributos: true,
  };
  // ======================================================

  // ========== ESTADOS (DEFINIDOS LOCALMENTE) ==========
  readonly estadosDropdown = ESTADOS_ACTIVIDAD_DROPDOWN;
  // ====================================================

  form: FormGroup = this.fb.group({
    oidCargoActividad: [null, Validators.required],
    oidTipoActividad: [null, Validators.required],
    oidEstadoActividad: [null, Validators.required],
    nombreActividad: ['', [Validators.required, Validators.maxLength(255)]],
    semanas: [null, [Validators.required, Validators.min(1)]],
    oidCalendario: [null, Validators.required],
    atributos: this.fb.array([]),
  });

  get atributosArray(): FormArray {
    return this.form.get('atributos') as FormArray;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['actividad'] && this.actividad) {
      this.cargarDesdeActividad();
    }
  }

  private cargarDesdeActividad(): void {
    const a = this.actividad.actividad as any;

    this.form.patchValue({
      oidCargoActividad: a.oidCargoActividad ?? null,
      oidTipoActividad: a.oidTipoActividad,
      oidEstadoActividad: a.oidEstadoActividad,
      nombreActividad: a.nombreActividad,
      semanas: a.semanas,
      oidCalendario: this.actividad.oidCalendario,
    });

    // Mapear atributos
    const attrsFG = (a.atributos ?? []).map((attr: any) =>
      this.fb.group({
        nombre: [attr.codigoAtributo],
        tipo: ['VARCHAR'],
        valor: [attr.valor, Validators.required],
      })
    );

    this.form.setControl('atributos', this.fb.array(attrsFG));
  }

  cerrar(): void {
    this.onCerrar.emit();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const dto: UpdateActividadDTO = {
      oidActividad: this.actividad.actividad.oidActividad,
      oidTipoActividad: raw.oidTipoActividad,
      oidEstadoActividad: raw.oidEstadoActividad,
      nombreActividad: raw.nombreActividad,
      semanas: raw.semanas,
      horas: this.actividad.actividad.horas,
      oidCalendario: raw.oidCalendario,
      atributos: raw.atributos as CreateAtributoDTO[],
    };

    this.onGuardar.emit(dto);
  }
}
