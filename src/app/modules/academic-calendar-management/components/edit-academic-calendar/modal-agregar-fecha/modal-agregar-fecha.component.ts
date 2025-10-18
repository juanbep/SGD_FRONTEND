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
import { NombreFecha } from '../../../models';
@Component({
  selector: 'app-modal-agregar-fecha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-agregar-fecha.component.html',
  styleUrl: './modal-agregar-fecha.component.css',
})
export class ModalAgregarFechaComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  // ===== INPUTS/OUTPUTS =====
  @Input() visible: boolean = false;
  @Input() catalogoNombresFecha: {
    value: number;
    label: string;
    tieneTemplate: boolean;
  }[] = [];
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

  selectTipoFecha(value: number): void {
    this.fechaForm.patchValue({ oidNombreFecha: value });
  }

  getSelectedLabel(): string {
    const value = this.nombreFechaControl?.value;
    if (!value) return '';

    const selected = this.catalogoNombresFecha.find(
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
