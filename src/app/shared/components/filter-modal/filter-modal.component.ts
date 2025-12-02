import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

export interface CampoFiltro {
  nombre: string;
  etiqueta: string;
  tipo: 'texto' | 'select' | 'numero';
  opciones?: { valor: string; etiqueta: string }[];
  placeholder?: string;
  icono?: string;
}

export interface ValoresFiltros {
  [key: string]: string | number;
}

@Component({
  selector: 'shared-filter-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filter-modal.component.html',
  styleUrl: './filter-modal.component.css',
})
export class FilterModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Input() titulo: string = 'Filtros de Búsqueda';
  @Input() campos: CampoFiltro[] = [];

  @Output() aplicar = new EventEmitter<ValoresFiltros>();
  @Output() limpiar = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  formulario: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.formulario = this.fb.group({});
  }

  ngOnChanges(): void {
    if (this.campos && this.campos.length > 0) {
      this.construirFormulario();
    }
  }

  construirFormulario(): void {
    const controles: { [key: string]: any } = {};
    for (const campo of this.campos) {
      controles[campo.nombre] = [''];
    }
    this.formulario = this.fb.group(controles);
  }

  aplicarFiltros(): void {
    const valores = this.formulario.value;
    this.aplicar.emit(valores);
    this.cerrarModal();
  }

  limpiarFiltros(): void {
    this.formulario.reset();
    this.limpiar.emit();
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  obtenerIcono(campo: CampoFiltro): string {
    if (campo.icono) return campo.icono;

    // Iconos por defecto según tipo
    switch (campo.tipo) {
      case 'texto':
        return 'fas fa-font';
      case 'numero':
        return 'fas fa-hashtag';
      case 'select':
        return 'fas fa-list';
      default:
        return 'fas fa-filter';
    }
  }
}
