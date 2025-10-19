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
} from '../../../models';
import { ActivatedRoute } from '@angular/router';
import { Utils } from '../../../utils/calendario.utils';
@Component({
  selector: 'app-modal-agregar-fecha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-agregar-fecha.component.html',
  styleUrl: './modal-agregar-fecha.component.css',
})
export class ModalAgregarFechaComponent implements OnInit, OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  // ===== INPUTS/OUTPUTS =====
  @Input() visible: boolean = false;
  @Input() listaNombreFechas: {
    value: number;
    label: string;
    tieneTemplate: boolean;
  }[] = [];
  @Input() oidCalendario: number = 0;
  @Input() guardando: boolean = false;
  @Input() fechaAEditar: Fecha | null = null;
  @Output() onConfirmar = new EventEmitter<CreateFechaDto>();
  @Output() onConfirmarEdicion = new EventEmitter<UpdateFechaDto>();
  @Output() onCancelar = new EventEmitter<void>();

  // ===== CONSTANTES =====
  readonly OIDS_FECHA_UNICA = [1, 6, 7, 8, 10, 12, 14, 15, 16, 18, 19];

  // ===== SIGNALS =====
  readonly tipoFechaSeleccionado = signal<number | null>(null);
  readonly fechaActual = signal<Fecha | null>(null);

  // ===== COMPUTED =====
  readonly esFechaUnica = computed(() => {
    const oid = this.tipoFechaSeleccionado();
    return oid !== null && this.OIDS_FECHA_UNICA.includes(oid);
  });
  readonly modoEdicion = computed(() => this.fechaActual() !== null);
  readonly tituloModal = computed(() => {
    return this.modoEdicion() ? 'Editar Fecha' : 'Agregar Nueva Fecha';
  });
  readonly iconoModal = computed(() => {
    return this.modoEdicion() ? 'fa-edit' : 'fa-calendar-plus';
  });

  // ===== FORMULARIO =====
  fechaForm!: FormGroup;

  ngOnInit(): void {
    this.inicializarFormulario();
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
  }

  private inicializarFormulario(): void {
    this.fechaForm = this.fb.group({
      oidNombreFecha: [null, Validators.required],
      fechaInicial: [null, Validators.required],
      fechaFin: [null],
    });

    // Observar cambios en oidNombreFecha
    this.fechaForm.get('oidNombreFecha')?.valueChanges.subscribe((oid) => {
      this.tipoFechaSeleccionado.set(oid ? Number(oid) : null);
      this.ajustarValidacionesFecha(oid ? Number(oid) : null);
    });
  }

  private cargarDatosFecha(fecha: Fecha): void {
    // Convertir fechas de DateTime a formato date input (YYYY-MM-DD)
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
    // Extrae "2025-08-07" de "2025-08-07T00:00:00"
    return fechaDateTime.split('T')[0];
  }

  private ajustarValidacionesFecha(oid: number | null): void {
    const fechaFinControl = this.fechaForm.get('fechaFin');

    if (oid !== null && this.OIDS_FECHA_UNICA.includes(oid)) {
      // Fecha única: fechaFin no es necesaria
      fechaFinControl?.clearValidators();
      fechaFinControl?.setValue(null);
    } else if (oid !== null) {
      // Rango: fechaFin es requerida
      fechaFinControl?.setValidators([Validators.required]);
    }

    fechaFinControl?.updateValueAndValidity();
  }

  // ===== MÉTODO CONFIRMAR =====
  confirmar(): void {
    if (this.fechaForm.invalid) {
      this.fechaForm.markAllAsTouched();
      return;
    }

    const formValues = this.fechaForm.value;

    if (this.modoEdicion()) {
      // Modo edición
      const updateDto: UpdateFechaDto = {
        oidFecha: this.fechaAEditar!.oidFecha,
        oidCalendario: this.oidCalendario,
        oidNombreFecha: Number(formValues.oidNombreFecha),
        tipo: 'RESALTADAS',
        fechaInicial: Utils.convertirFechaADateTime(formValues.fechaInicial)!,
        fechaFin: this.esFechaUnica()
          ? null
          : Utils.convertirFechaADateTime(formValues.fechaFin)!,
      };
      this.onConfirmarEdicion.emit(updateDto);
    } else {
      // Modo crear
      const createDto: CreateFechaDto = {
        oidCalendario: this.oidCalendario,
        oidNombreFecha: Number(formValues.oidNombreFecha),
        tipo: 'RESALTADAS',
        fechaInicial: Utils.convertirFechaADateTime(formValues.fechaInicial)!,
        fechaFin: this.esFechaUnica()
          ? null
          : Utils.convertirFechaADateTime(formValues.fechaFin)!,
      };
      this.onConfirmar.emit(createDto);
    }
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
    this.fechaForm.reset();
    this.tipoFechaSeleccionado.set(null);
    this.fechaActual.set(null);
  }

  cancelar(): void {
    this.fechaForm.reset();
    this.onCancelar.emit();
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
}
