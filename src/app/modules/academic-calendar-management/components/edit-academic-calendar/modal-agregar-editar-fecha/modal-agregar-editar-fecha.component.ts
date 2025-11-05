import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
  computed,
  signal,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  CreateFechaDto,
  Fecha,
  NombreFecha,
  UpdateFechaDto,
  CreateNombreFechaDto,
} from '../../../models';
import { ActivatedRoute } from '@angular/router';
import { Utils } from '../../../utils/calendario.utils';

@Component({
  selector: 'app-modal-agregar-fecha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-agregar-editar-fecha.component.html',
  styleUrl: './modal-agregar-editar-fecha.component.css',
})
export class ModalAgregarEditarFechaComponent implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  // ===== INPUTS/OUTPUTS =====
  @Input() visible: boolean = false;
  @Input() listaNombreFechas: {
    value: number;
    label: string;
    tieneTemplate: boolean;
    uniqueDate: boolean;
  }[] = [];
  @Input() oidCalendario: number = 0;
  @Input() guardando: boolean = false;
  @Input() fechaAEditar: Fecha | null = null;
  @Output() onConfirmar = new EventEmitter<CreateFechaDto>();
  @Output() onConfirmarEdicion = new EventEmitter<UpdateFechaDto>();
  @Output() onCancelar = new EventEmitter<void>();
  @Output() onCrearNombreFecha = new EventEmitter<CreateNombreFechaDto>();

  // ===== SIGNALS =====
  readonly tipoFechaSeleccionado = signal<number | null>(null);
  readonly fechaActual = signal<Fecha | null>(null);
  readonly vistaActual = signal<'fecha' | 'crearNombre'>('fecha');

  // ===== COMPUTED =====
  readonly esFechaUnica = computed(() => {
    const oid = this.tipoFechaSeleccionado();
    if (oid === null) return false;

    const fechaEdicion = this.fechaActual();
    if (fechaEdicion) {
      return fechaEdicion.uniqueDate;
    }

    const nombreFecha = this.listaNombreFechas.find(
      (item) => item.value === oid
    );
    return nombreFecha?.uniqueDate ?? false;
  });

  readonly modoEdicion = computed(() => this.fechaActual() !== null);

  readonly tituloModal = computed(() => {
    if (this.vistaActual() === 'crearNombre') {
      return 'Crear Nuevo Tipo de Fecha';
    }
    return this.modoEdicion() ? 'Editar Fecha' : 'Agregar Nueva Fecha';
  });

  readonly iconoModal = computed(() => {
    if (this.vistaActual() === 'crearNombre') {
      return 'fa-plus-circle';
    }
    return this.modoEdicion() ? 'fa-edit' : 'fa-calendar-plus';
  });

  // ===== FORMULARIOS =====
  fechaForm!: FormGroup;
  nombreFechaForm!: FormGroup;

  ngOnInit(): void {
    this.inicializarFormularios();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.oidCalendario = +id;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fechaAEditar']) {
      this.fechaActual.set(this.fechaAEditar);

      if (this.fechaAEditar) {
        this.cargarDatosFecha(this.fechaAEditar);
      }
    }

    if (changes['visible'] && !this.visible) {
      this.resetearFormulario();
    }

    // Controlar disabled state cuando cambia guardando
    if (changes['guardando']) {
      this.actualizarEstadoDisabled();
    }
  }

  // Método para actualizar estado disabled de los FormControls
  private actualizarEstadoDisabled(): void {
    // Verificar que los formularios estén inicializados
    if (!this.fechaForm || !this.nombreFechaForm) {
      return;
    }

    if (this.guardando) {
      // Deshabilitar controles del formulario de fecha
      this.fechaForm.get('oidNombreFecha')?.disable({ emitEvent: false });
      this.fechaForm.get('fechaInicial')?.disable({ emitEvent: false });
      this.fechaForm.get('fechaFin')?.disable({ emitEvent: false });

      // Deshabilitar controles del formulario de nombre de fecha
      this.nombreFechaForm.get('nombre')?.disable({ emitEvent: false });
      this.nombreFechaForm.get('uniqueDate')?.disable({ emitEvent: false });
    } else {
      // Habilitar controles del formulario de fecha
      this.fechaForm.get('oidNombreFecha')?.enable({ emitEvent: false });
      this.fechaForm.get('fechaInicial')?.enable({ emitEvent: false });
      this.fechaForm.get('fechaFin')?.enable({ emitEvent: false });

      // Habilitar controles del formulario de nombre de fecha
      this.nombreFechaForm.get('nombre')?.enable({ emitEvent: false });
      this.nombreFechaForm.get('uniqueDate')?.enable({ emitEvent: false });
    }
  }

  private inicializarFormularios(): void {
    // Formulario para agregar/editar fecha
    this.fechaForm = this.fb.group({
      oidNombreFecha: [null, Validators.required],
      fechaInicial: [null, Validators.required],
      fechaFin: [null],
    });

    this.fechaForm.get('oidNombreFecha')?.valueChanges.subscribe((oid) => {
      this.tipoFechaSeleccionado.set(oid ? Number(oid) : null);
      this.ajustarValidacionesFecha(oid ? Number(oid) : null);
    });

    // Formulario para crear nombre de fecha
    this.nombreFechaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      uniqueDate: ['true', Validators.required],
    });
  }

  private cargarDatosFecha(fecha: Fecha): void {
    const fechaInicial = fecha.fechaInicial
      ? this.extraerSoloFecha(fecha.fechaInicial.toString())
      : null;
    const fechaFin = fecha.fechaFin
      ? this.extraerSoloFecha(fecha.fechaFin.toString())
      : null;

    this.fechaForm.patchValue({
      oidNombreFecha: fecha.oidNombreFecha,
      fechaInicial: fechaInicial,
      fechaFin: fechaFin,
    });
  }

  private extraerSoloFecha(fechaDateTime: string): string {
    return fechaDateTime.split('T')[0];
  }

  private ajustarValidacionesFecha(oid: number | null): void {
    const fechaFinControl = this.fechaForm.get('fechaFin');

    if (oid !== null && this.esFechaUnica()) {
      fechaFinControl?.clearValidators();
      fechaFinControl?.setValue(null);
    } else if (oid !== null) {
      fechaFinControl?.setValidators([Validators.required]);
    }

    fechaFinControl?.updateValueAndValidity();
  }

  cambiarAVistaCrearNombre(): void {
    this.nombreFechaForm.reset({ uniqueDate: 'true' });
    this.vistaActual.set('crearNombre');
  }

  volverAVistaFecha(): void {
    this.vistaActual.set('fecha');
    this.nombreFechaForm.reset({ uniqueDate: 'true' });
  }

  confirmar(): void {
    if (this.fechaForm.invalid) {
      this.fechaForm.markAllAsTouched();
      return;
    }

    const formValues = this.fechaForm.getRawValue();
    const esUnica = this.esFechaUnica();

    if (this.modoEdicion()) {
      const updateDto: UpdateFechaDto = {
        oidFecha: this.fechaAEditar!.oidFecha,
        oidCalendario: this.oidCalendario,
        oidNombreFecha: Number(formValues.oidNombreFecha),
        uniqueDate: esUnica,
        tipo: 'RESALTADAS',
        fechaInicial: Utils.convertirFechaADateTime(formValues.fechaInicial)!,
        fechaFin: esUnica
          ? null
          : Utils.convertirFechaADateTime(formValues.fechaFin)!,
      };
      this.onConfirmarEdicion.emit(updateDto);
    } else {
      const createDto: CreateFechaDto = {
        oidCalendario: this.oidCalendario,
        oidNombreFecha: Number(formValues.oidNombreFecha),
        uniqueDate: esUnica,
        tipo: 'RESALTADAS',
        fechaInicial: Utils.convertirFechaADateTime(formValues.fechaInicial)!,
        fechaFin: esUnica
          ? null
          : Utils.convertirFechaADateTime(formValues.fechaFin)!,
      };
      this.onConfirmar.emit(createDto);
    }
  }

  confirmarCrearNombre(): void {
    if (this.nombreFechaForm.invalid) {
      this.nombreFechaForm.markAllAsTouched();
      return;
    }

    // Conversión de string a boolean
    const uniqueDateValue = this.nombreFechaForm.value.uniqueDate;
    const uniqueDateBoolean =
      uniqueDateValue === 'true' || uniqueDateValue === true;

    const createDto: CreateNombreFechaDto = {
      nombre: this.nombreFechaForm.value.nombre.trim(),
      uniqueDate: uniqueDateBoolean,
    };

    this.onCrearNombreFecha.emit(createDto);
  }

  selectTipoFecha(value: number): void {
    this.fechaForm.patchValue({ oidNombreFecha: value });
  }

  getSelectedLabel(): string {
    const value = this.nombreFechaControl?.value;
    if (!value) return '';

    const selected = this.listaNombreFechas.find(
      (item) => item.value === Number(value)
    );
    return selected?.label || '';
  }

  private resetearFormulario(): void {
    this.tipoFechaSeleccionado.set(null);
    this.fechaActual.set(null);
    this.vistaActual.set('fecha');
    //this.fechaForm.reset();
    //this.nombreFechaForm.reset({ uniqueDate: 'true' });
  }

  cancelar(): void {
    if (this.vistaActual() === 'crearNombre') {
      this.volverAVistaFecha();
      return;
    }

    this.fechaForm.reset();
    this.onCancelar.emit();
  }

  // ===== GETTERS =====
  get nombreFechaControl() {
    return this.fechaForm.get('oidNombreFecha');
  }

  get fechaInicialControl() {
    return this.fechaForm.get('fechaInicial');
  }

  get fechaFinControl() {
    return this.fechaForm.get('fechaFin');
  }

  get nombreControl() {
    return this.nombreFechaForm.get('nombre');
  }

  get uniqueDateControl() {
    return this.nombreFechaForm.get('uniqueDate');
  }
}
