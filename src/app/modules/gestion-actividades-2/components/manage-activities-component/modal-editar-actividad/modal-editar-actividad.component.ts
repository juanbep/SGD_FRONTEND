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
  UpdateActividadDTO,
  UsuarioActividad,
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

  // ======== CONFIGURACIÓN DE CAMPOS EDITABLES =========

  camposEditables = {
    nombreActividad: true,
    tipoActividad: false,
    calendario: false,
    estado: true,
    semanas: true,
    atributos: true,
  };

  // ==================== ESTADOS ========================

  readonly estadosDropdown = ESTADOS_ACTIVIDAD_DROPDOWN;

  // =====================================================

  form: FormGroup = this.fb.group({
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
      oidTipoActividad: a.oidTipoActividad,
      oidEstadoActividad: a.oidEstadoActividad,
      nombreActividad: a.nombreActividad,
      semanas: a.semanas,
      oidCalendario: this.actividad.oidCalendario,
    });

    // Deshabilitar campos según configuración
    if (!this.camposEditables.tipoActividad) {
      this.form.get('oidTipoActividad')?.disable();
    }
    if (!this.camposEditables.calendario) {
      this.form.get('oidCalendario')?.disable();
    }
    if (!this.camposEditables.nombreActividad) {
      this.form.get('nombreActividad')?.disable();
    }
    if (!this.camposEditables.estado) {
      this.form.get('oidEstadoActividad')?.disable();
    }
    if (!this.camposEditables.semanas) {
      this.form.get('semanas')?.disable();
    }

    // Mapear atributos
    const attrsFG = (a.atributos ?? []).map((attr: any) =>
      this.fb.group({
        nombre: [{ value: attr.codigoAtributo, disabled: true }],
        tipo: ['VARCHAR'],
        valor: [
          { value: attr.valor, disabled: !this.camposEditables.atributos },
          Validators.required,
        ],
      })
    );

    this.form.setControl('atributos', this.fb.array(attrsFG));
  }

  private mapearUsuariosParaDTO(): UsuarioActividad[] {
    return this.actividad.usuariosActividad.map((ua) => ({
      oidUsuario: ua.oidUsuario,
      oidCargoActividad: ua.oidCargoActividad,
      horas: ua.horas,
    }));
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

    // Mapear atributos al formato correcto
    const atributos = raw.atributos.map((attr: any) => ({
      nombre: attr.nombre,
      tipo: attr.tipo || 'VARCHAR',
      valor: attr.valor,
    }));

    const dto: UpdateActividadDTO = {
      oidActividad: this.actividad.actividad.oidActividad,
      oidTipoActividad: this.actividad.actividad.tipoActividad.oidTipoActividad,
      oidEstadoActividad: raw.oidEstadoActividad,
      nombreActividad: raw.nombreActividad,
      semanas: raw.semanas,
      oidCalendario: this.actividad.oidCalendario,
      usuarios: this.mapearUsuariosParaDTO(),
      atributos: atributos,
    };

    this.onGuardar.emit(dto);
  }
}
