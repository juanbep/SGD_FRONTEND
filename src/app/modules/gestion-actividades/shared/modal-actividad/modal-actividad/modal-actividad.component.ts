import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActividadEnMemoria,
  AtributoActividad,
} from '../../../models/actividad.model';
import { SubtipoActividadConfig } from '../../../config/actividades-metadata.config';

@Component({
  selector: 'app-modal-actividad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-actividad.component.html',
  styleUrl: './modal-actividad.component.css',
})
export class ModalActividadComponent implements OnInit {
  @Input() visible = false;
  @Input() metadata!: SubtipoActividadConfig;
  @Input() actividadAEditar: ActividadEnMemoria | null = null;
  @Output() onGuardar = new EventEmitter<ActividadEnMemoria>();
  @Output() onCancelar = new EventEmitter<void>();

  actividadForm!: FormGroup;
  readonly agregarOtra = signal(true);
  readonly modoEdicion = signal(false);

  readonly estadosActividad = [
    { oid: 1, nombre: 'Inactiva' },
    { oid: 2, nombre: 'Activa' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    if (this.actividadAEditar) {
      this.modoEdicion.set(true);
      this.cargarDatosActividad(this.actividadAEditar);
    }
  }

  private inicializarFormulario(): void {
    const formConfig: any = {
      nombreActividad: ['', [Validators.required, Validators.minLength(3)]],
      semanas: [16, [Validators.required, Validators.min(1)]],
      oidEstadoActividad: [2, Validators.required],
    };

    // Agregar controles dinámicos para cada atributo
    this.metadata.atributos.forEach((attr) => {
      const validators = [];
      if (attr.requerido) {
        validators.push(Validators.required);
      }
      if (attr.validaciones?.minLength) {
        validators.push(Validators.minLength(attr.validaciones.minLength));
      }
      if (attr.validaciones?.maxLength) {
        validators.push(Validators.maxLength(attr.validaciones.maxLength));
      }
      if (attr.validaciones?.min) {
        validators.push(Validators.min(attr.validaciones.min));
      }
      if (attr.validaciones?.max) {
        validators.push(Validators.max(attr.validaciones.max));
      }
      if (attr.validaciones?.pattern) {
        validators.push(Validators.pattern(attr.validaciones.pattern));
      }

      formConfig[attr.nombre] = ['', validators];
    });

    this.actividadForm = this.fb.group(formConfig);
  }

  private cargarDatosActividad(actividad: ActividadEnMemoria): void {
    this.actividadForm.patchValue({
      nombreActividad: actividad.nombreActividad,
      semanas: actividad.semanas,
      oidEstadoActividad: actividad.oidEstadoActividad,
    });

    // Cargar atributos
    actividad.atributos.forEach((attr) => {
      const control = this.actividadForm.get(attr.nombre);
      if (control) {
        control.setValue(attr.valor);
      }
    });
  }

  confirmar(): void {
    if (this.actividadForm.invalid) {
      this.actividadForm.markAllAsTouched();
      return;
    }

    const formValues = this.actividadForm.value;

    // Construir array de atributos
    const atributos: AtributoActividad[] = this.metadata.atributos.map(
      (attr) => ({
        nombre: attr.nombre,
        tipo: attr.tipoValor,
        valor: formValues[attr.nombre]?.toString() || '',
      })
    );

    const actividad: ActividadEnMemoria = {
      ...this.actividadAEditar,
      oidTipoActividad: this.metadata.oidTipoActividad,
      oidEstadoActividad: formValues.oidEstadoActividad,
      nombreActividad: formValues.nombreActividad,
      semanas: formValues.semanas,
      oidCalendario: this.actividadAEditar?.oidCalendario || 0,
      usuarios: this.actividadAEditar?.usuarios || [],
      atributos: atributos,
    };

    this.onGuardar.emit(actividad);

    if (!this.modoEdicion() && this.agregarOtra()) {
      this.resetearFormulario();
    } else {
      this.cancelar();
    }
  }

  cancelar(): void {
    this.onCancelar.emit();
  }

  private resetearFormulario(): void {
    this.actividadForm.reset({
      semanas: 16,
      oidEstadoActividad: 2,
    });
  }

  getControl(nombre: string) {
    return this.actividadForm.get(nombre);
  }
}
