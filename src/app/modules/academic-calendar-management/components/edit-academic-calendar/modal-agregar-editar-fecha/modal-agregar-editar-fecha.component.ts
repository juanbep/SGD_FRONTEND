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
  UpdateFechaDto,
  CreateNombreFechaDto,
} from '../../../models';
import { ActivatedRoute } from '@angular/router';
import { Utils } from '../../../utils/calendario.utils';
import { NgSelectModule } from '@ng-select/ng-select';

export type TipoFecha = 'RESALTADAS' | 'NO_RESALTADAS' | 'ADMINISTRATIVAS';

@Component({
  selector: 'app-modal-agregar-fecha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './modal-agregar-editar-fecha.component.html',
  styleUrl: './modal-agregar-editar-fecha.component.css',
})
export class ModalAgregarEditarFechaComponent implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  @Input() visible: boolean = false;
  @Input() listaNombreFechas: {
    value: number;
    label: string;
    tieneTemplate: boolean;
    uniqueDate: boolean;
    tipo?: TipoFecha;
  }[] = [];
  @Input() oidCalendario: number = 0;
  @Input() guardando: boolean = false;
  @Input() fechaAEditar: Fecha | null = null;
  @Input() anioCalendario: number = 0;
  @Input() numeroCalendario: number = 0;
  @Output() onConfirmar = new EventEmitter<CreateFechaDto>();
  @Output() onConfirmarEdicion = new EventEmitter<UpdateFechaDto>();
  @Output() onCancelar = new EventEmitter<void>();
  @Output() onCrearNombreFecha = new EventEmitter<CreateNombreFechaDto>();

  readonly TIPOS_FECHA: { value: TipoFecha; label: string }[] = [
    { value: 'RESALTADAS', label: 'Resaltadas' },
    { value: 'NO_RESALTADAS', label: 'No Resaltadas' },
    { value: 'ADMINISTRATIVAS', label: 'Administrativas' },
  ];

  readonly nombreFechaSeleccionado = signal<number | null>(null);
  readonly fechaActual = signal<Fecha | null>(null);
  readonly vistaActual = signal<'fecha' | 'crearNombre'>('fecha');
  readonly nombreFechaSeleccionadoLabel = signal<string>('');

  readonly nombresFechaFiltrados = computed(() => {
    const calendarioTexto = `${this.anioCalendario}-${this.numeroCalendario}`;

    return this.listaNombreFechas.map((item) => ({
      ...item,
      label: item.label.replace(/{calendar}/g, calendarioTexto),
    }));
  });

  readonly esFechaUnica = computed(() => {
    const oid = this.nombreFechaSeleccionado();
    if (oid === null) return false;

    const fechaEdicion = this.fechaActual();
    if (fechaEdicion) {
      return fechaEdicion.uniqueDate;
    }

    const nombreFecha = this.nombresFechaFiltrados().find(
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

      this.actualizarEstadoDisabled();
    }

    if (changes['visible'] && !this.visible) {
      this.resetearFormulario();
    }

    if (changes['guardando']) {
      this.actualizarEstadoDisabled();
    }
  }

  private actualizarEstadoDisabled(): void {
    if (!this.fechaForm || !this.nombreFechaForm) {
      return;
    }

    if (this.guardando) {
      this.fechaForm.get('tipoFecha')?.disable({ emitEvent: false });
      this.fechaForm.get('oidNombreFecha')?.disable({ emitEvent: false });
      this.fechaForm.get('fechaInicial')?.disable({ emitEvent: false });
      this.fechaForm.get('fechaFin')?.disable({ emitEvent: false });
      this.nombreFechaForm.get('nombre')?.disable({ emitEvent: false });
      this.nombreFechaForm.get('uniqueDate')?.disable({ emitEvent: false });
    } else {
      if (this.modoEdicion()) {
        this.fechaForm.get('tipoFecha')?.disable({ emitEvent: false });
        this.fechaForm.get('oidNombreFecha')?.disable({ emitEvent: false });
      } else {
        this.fechaForm.get('tipoFecha')?.enable({ emitEvent: false });
        this.fechaForm.get('oidNombreFecha')?.enable({ emitEvent: false });
      }

      this.fechaForm.get('fechaInicial')?.enable({ emitEvent: false });
      this.fechaForm.get('fechaFin')?.enable({ emitEvent: false });
      this.nombreFechaForm.get('nombre')?.enable({ emitEvent: false });
      this.nombreFechaForm.get('uniqueDate')?.enable({ emitEvent: false });
    }
  }

  private inicializarFormularios(): void {
    this.fechaForm = this.fb.group({
      tipoFecha: [null, Validators.required],
      oidNombreFecha: [null, Validators.required],
      fechaInicial: [null, Validators.required],
      fechaFin: [null],
    });

    this.fechaForm.get('oidNombreFecha')?.valueChanges.subscribe((oid) => {
      this.nombreFechaSeleccionado.set(oid ? Number(oid) : null);
      this.ajustarValidacionesFecha(oid ? Number(oid) : null);
    });

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

    const tipoFecha = (fecha as any).tipo || 'RESALTADAS';

    this.fechaForm.patchValue({
      tipoFecha: tipoFecha,
      oidNombreFecha: fecha.oidNombreFecha,
      fechaInicial: fechaInicial,
      fechaFin: fechaFin,
    });

    this.nombreFechaSeleccionadoLabel.set(fecha.nombre);
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
    const tipoFecha = formValues.tipoFecha;

    if (this.modoEdicion()) {
      const updateDto: UpdateFechaDto = {
        oidFecha: this.fechaAEditar!.oidFecha,
        oidCalendario: this.oidCalendario,
        oidNombreFecha: Number(formValues.oidNombreFecha),
        uniqueDate: esUnica,
        tipo: tipoFecha,
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
        tipo: tipoFecha,
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

    const uniqueDateValue = this.nombreFechaForm.value.uniqueDate;
    const uniqueDateBoolean =
      uniqueDateValue === 'true' || uniqueDateValue === true;

    const createDto: CreateNombreFechaDto = {
      nombre: this.nombreFechaForm.value.nombre.trim(),
      uniqueDate: uniqueDateBoolean,
    };

    this.onCrearNombreFecha.emit(createDto);
  }

  private resetearFormulario(): void {
    this.nombreFechaSeleccionado.set(null);
    this.nombreFechaSeleccionadoLabel.set('');
    this.fechaActual.set(null);
    this.vistaActual.set('fecha');
  }

  cancelar(): void {
    if (this.vistaActual() === 'crearNombre') {
      this.volverAVistaFecha();
      return;
    }

    this.fechaForm.reset({ tipoFecha: null });
    this.onCancelar.emit();
  }

  get tipoFechaControl() {
    return this.fechaForm.get('tipoFecha');
  }

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
