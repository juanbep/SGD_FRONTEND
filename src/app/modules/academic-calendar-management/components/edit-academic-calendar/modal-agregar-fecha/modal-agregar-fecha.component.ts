import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CreateFechaDto, NombreFecha } from '../../../models';
import { ActivatedRoute } from '@angular/router';
import { Utils } from '../../../utils/calendario.utils';
@Component({
  selector: 'app-modal-agregar-fecha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-agregar-fecha.component.html',
  styleUrl: './modal-agregar-fecha.component.css',
})
export class ModalAgregarFechaComponent implements OnInit {
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
  @Output() onConfirmar = new EventEmitter<CreateFechaDto>();
  @Output() onCancelar = new EventEmitter<void>();

  // ===== CONSTANTES =====
  readonly OIDS_FECHA_UNICA = [1, 6, 7, 8, 10, 12, 14, 15, 16, 18, 19];

  // ===== SIGNALS =====
  readonly tipoFechaSeleccionado = signal<number | null>(null);

  // ===== COMPUTED =====
  readonly esFechaUnica = computed(() => {
    const oid = this.tipoFechaSeleccionado();
    return oid !== null && this.OIDS_FECHA_UNICA.includes(oid);
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

    const createDto: CreateFechaDto = {
      oidCalendario: this.oidCalendario,
      oidNombreFecha: Number(formValues.oidNombreFecha),
      tipo: 'RESALTADAS',
      fechaInicial: Utils.convertirFechaADateTime(formValues.fechaInicial)!,
      // Si es fecha única, enviar null; si es rango, enviar la fecha final
      fechaFin: this.esFechaUnica()
        ? null // Enviar null para fechas únicas
        : Utils.convertirFechaADateTime(formValues.fechaFin)!,
    };

    this.onConfirmar.emit(createDto);
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
