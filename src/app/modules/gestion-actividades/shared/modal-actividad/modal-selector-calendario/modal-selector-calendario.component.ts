import {
  Component,
  Output,
  EventEmitter,
  OnInit,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarioHelperService } from '../../../../academic-calendar-management/services';

export interface Calendario {
  value: number; // oidcalendario
  label: string; // Nombre formateado
  estado: string; // EstadoCalendario
}

@Component({
  selector: 'app-modal-selector-calendario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-selector-calendario.component.html',
  styleUrl: './modal-selector-calendario.component.css',
})
export class ModalSelectorCalendarioComponent implements OnInit {
  private readonly calendarioService = inject(CalendarioHelperService);

  @Output() onSeleccionar = new EventEmitter<Calendario>();
  @Output() onCerrar = new EventEmitter<void>();

  readonly calendarios = signal<Calendario[]>([]);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarCalendarios();
  }

  private async cargarCalendarios(): Promise<void> {
    this.cargando.set(true);
    this.error.set(null);

    try {
      const calendarios = await this.calendarioService.getAllForDropdown();
      this.calendarios.set(calendarios);
    } catch (err: any) {
      console.error('Error al cargar calendarios:', err);
      this.error.set('Error al cargar los calendarios. Intente nuevamente.');
    } finally {
      this.cargando.set(false);
    }
  }

  seleccionarCalendario(calendario: Calendario): void {
    this.onSeleccionar.emit(calendario);
  }

  cerrar(): void {
    this.onCerrar.emit();
  }

  reintentar(): void {
    this.cargarCalendarios();
  }
}
