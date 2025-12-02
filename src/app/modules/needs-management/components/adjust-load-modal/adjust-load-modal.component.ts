import { Component, EventEmitter, input, Output, OnInit, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface AjusteCargueData {
  cupo: number;
  cantidadGrupos: number;
  cuposPorGrupo: number;
  aplicarSoloCamposVacios: boolean;
}

@Component({
  selector: 'app-adjust-load-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './adjust-load-modal.component.html',
  styleUrl: './adjust-load-modal.component.css',
})
export class AdjustLoadModalComponent implements OnInit {
  visible = input<boolean>(false);
  @Output() cerrar = new EventEmitter<void>();
  @Output() aplicar = new EventEmitter<AjusteCargueData>();

  ajusteForm: FormGroup;
  cuposPorGrupo = signal(0);

  constructor(private readonly fb: FormBuilder) {
    this.ajusteForm = this.fb.group({
      cupo: [0],
      cantidadGrupos: [''],
      aplicarSoloCamposVacios: [false],
    });

    // Efecto para resetear form cuando el modal se cierre
    effect(() => {
      if (!this.visible()) {
        this.ajusteForm.reset({ cupo: 0, cantidadGrupos: '', aplicarSoloCamposVacios: false });
        this.cuposPorGrupo.set(0);
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.ajusteForm.valueChanges.subscribe(() => {
      this.calcularCuposPorGrupo();
    });
  }

  calcularCuposPorGrupo(): void {
    const cupo = this.ajusteForm.get('cupo')?.value || 0;
    const cantidadGrupos = parseInt(this.ajusteForm.get('cantidadGrupos')?.value) || 0;

    if (cupo > 0 && cantidadGrupos > 0) {
      this.cuposPorGrupo.set(Math.floor(cupo / cantidadGrupos));
    } else {
      this.cuposPorGrupo.set(0);
    }
  }

  onCerrar(): void {
    this.ajusteForm.reset({ cupo: 0, cantidadGrupos: '', aplicarSoloCamposVacios: false });
    this.cuposPorGrupo.set(0);
    this.cerrar.emit();
  }

  onAplicar(): void {
    const valores = this.ajusteForm.value;
    this.aplicar.emit({
      cupo: valores.cupo,
      cantidadGrupos: parseInt(valores.cantidadGrupos),
      cuposPorGrupo: this.cuposPorGrupo(),
      aplicarSoloCamposVacios: valores.aplicarSoloCamposVacios,
    });
    this.onCerrar();
  }
}
