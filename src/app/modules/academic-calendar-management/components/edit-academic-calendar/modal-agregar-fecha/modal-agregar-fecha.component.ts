import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
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
}
