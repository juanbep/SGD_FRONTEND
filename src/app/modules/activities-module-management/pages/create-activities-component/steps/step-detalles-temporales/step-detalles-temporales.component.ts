import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  inject,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DetallesTemporalesData } from '../../../../models/create-actividad-wizard.model';

interface EstadoActividad {
  oid: number;
  nombre: string;
  descripcion: string;
  color: string;
}
@Component({
  selector: 'app-step-detalles-temporales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-detalles-temporales.component.html',
  styleUrl: './step-detalles-temporales.component.css',
})
export class StepDetallesTemporalesComponent implements OnInit {
  private readonly toastr = inject(ToastrService);

  @Input() datos!: DetallesTemporalesData;
  @Output() cambio = new EventEmitter<DetallesTemporalesData>();
  @Output() validezCambiada = new EventEmitter<boolean>();

  // ===== SIGNALS =====
  readonly formData = signal<DetallesTemporalesData>({
    horas: null,
    semanas: null,
    oidEstadoActividad: 3, // INCOMPLETA por defecto
  });

  readonly camposTocados = signal<{ [key: string]: boolean }>({
    horas: false,
    semanas: false,
    oidEstadoActividad: false,
  });

  // Estados disponibles
  readonly estadosActividad: EstadoActividad[] = [
    {
      oid: 1,
      nombre: 'ACTIVA',
      descripcion: 'La actividad está en curso',
      color: 'success',
    },
    {
      oid: 2,
      nombre: 'INACTIVA',
      descripcion: 'Temporalmente suspendida',
      color: 'warning',
    },
    {
      oid: 3,
      nombre: 'INCOMPLETA',
      descripcion: 'Faltan datos por completar',
      color: 'secondary',
    },
  ];

  // ===== COMPUTED =====
  readonly horasPorSemana = computed(() => {
    const horas = this.formData().horas;
    const semanas = this.formData().semanas;

    if (horas && semanas && semanas > 0) {
      return (horas * semanas).toFixed(2);
    }
    return null;
  });

  readonly estadoSeleccionado = computed(() => {
    const oid = this.formData().oidEstadoActividad;
    return this.estadosActividad.find((e) => e.oid === oid);
  });

  readonly formularioValido = computed(() => {
    // Este paso es OPCIONAL, siempre es válido
    // Pero si llenan algo, debe ser válido
    const form = this.formData();

    // Si no llenaron nada, es válido (opcional)
    if (!form.horas && !form.semanas) {
      return true;
    }

    // Si llenaron algo, ambos deben estar
    return !!(form.horas && form.semanas && form.horas > 0 && form.semanas > 0);
  });

  constructor() {
    // Effect para emitir cambios
    effect(() => {
      this.cambio.emit(this.formData());
    });

    // Effect para validez
    effect(() => {
      this.validezCambiada.emit(this.formularioValido());
    });
  }

  ngOnInit(): void {
    if (this.datos) {
      this.formData.set({ ...this.datos });
    }
  }

  // ===== EVENTOS =====

  onHorasChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value ? Number(input.value) : null;

    this.formData.update((data) => ({
      ...data,
      horas: value,
    }));

    this.alCambiarHoras();
  }

  onSemanasChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value ? Number(input.value) : null;

    this.formData.update((data) => ({
      ...data,
      semanas: value,
    }));

    this.alCambiarSemanas();
  }

  onEstadoChange(oid: number): void {
    this.formData.update((data) => ({
      ...data,
      oidEstadoActividad: oid,
    }));

    this.alCambiarEstado();
  }

  alCambiarHoras(): void {
    this.marcarComoTocado('horas');
  }

  alCambiarSemanas(): void {
    this.marcarComoTocado('semanas');
  }

  alCambiarEstado(): void {
    this.marcarComoTocado('oidEstadoActividad');
  }

  // ===== VALIDACIÓN =====

  marcarComoTocado(campo: string): void {
    this.camposTocados.update((tocados) => ({
      ...tocados,
      [campo]: true,
    }));
  }

  marcarTodoComoTocado(): void {
    this.camposTocados.set({
      horas: true,
      semanas: true,
      oidEstadoActividad: true,
    });
  }

  mostrarError(campo: string): boolean {
    const form = this.formData();
    const tocado = this.camposTocados()[campo];

    if (!tocado) return false;

    switch (campo) {
      case 'horas':
        // Solo error si llenó semanas pero no horas
        return !!form.semanas && !form.horas;
      case 'semanas':
        // Solo error si llenó horas pero no semanas
        return !!form.horas && !form.semanas;
      default:
        return false;
    }
  }

  obtenerMensajeError(campo: string): string {
    switch (campo) {
      case 'horas':
        return 'Si especifica semanas, debe especificar horas';
      case 'semanas':
        return 'Si especifica horas, debe especificar semanas';
      default:
        return '';
    }
  }

  // ===== ACCIONES =====

  omitirPaso(): void {
    // Dejar valores por defecto
    this.formData.set({
      horas: null,
      semanas: null,
      oidEstadoActividad: 3, // INCOMPLETA
    });
  }
}
