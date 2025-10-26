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
import { CreateAtributoDTO } from '../../../../models';
import { AtributoPredefinido } from '../../../../models/create-actividad-wizard.model';
import {
  ATRIBUTOS_DISPONIBLES,
  obtenerTipoInput,
  obtenerPlaceholder,
  obtenerIconoAtributo,
  formatearNombreAtributo,
} from '../../../../utils/actividad-utils';

// Valor ingresado por el usuario
interface ValorAtributo {
  atributo: AtributoPredefinido;
  valor: string;
}

@Component({
  selector: 'app-step-atributos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-atributos.component.html',
  styleUrl: './step-atributos.component.css',
})
export class StepAtributosComponent implements OnInit {
  private readonly toastr = inject(ToastrService);

  @Input() atributos: CreateAtributoDTO[] = [];
  @Output() cambio = new EventEmitter<CreateAtributoDTO[]>();
  @Output() validezCambiada = new EventEmitter<boolean>();

  // ===== CONSTANTES IMPORTADAS =====
  readonly ATRIBUTOS_DISPONIBLES = ATRIBUTOS_DISPONIBLES;

  // ===== SIGNALS =====
  readonly valoresAtributos = signal<ValorAtributo[]>([]);

  // ===== COMPUTED =====
  readonly formularioValido = computed(() => {
    return true; // Opcional
  });

  readonly hayAtributos = computed(() => {
    return this.valoresAtributos().length > 0;
  });

  readonly atributosDisponibles = computed(() => {
    const agregados = this.valoresAtributos().map((v) => v.atributo.nombre);
    return ATRIBUTOS_DISPONIBLES.filter((a) => !agregados.includes(a.nombre));
  });

  constructor() {
    effect(() => {
      const dtos: CreateAtributoDTO[] = this.valoresAtributos().map((v) => ({
        nombre: v.atributo.nombre,
        tipo: v.atributo.tipoAtributo,
        valor: v.valor,
      }));
      this.cambio.emit(dtos);
    });

    effect(() => {
      this.validezCambiada.emit(this.formularioValido());
    });
  }

  ngOnInit(): void {
    if (this.atributos && this.atributos.length > 0) {
      const valores: ValorAtributo[] = this.atributos
        .map((dto) => {
          const atributo = ATRIBUTOS_DISPONIBLES.find(
            (a) => a.nombre === dto.nombre
          );
          return atributo ? { atributo, valor: dto.valor } : null;
        })
        .filter((v): v is ValorAtributo => v !== null);

      this.valoresAtributos.set(valores);
    }
  }

  // ===== AGREGAR ATRIBUTO =====
  agregarAtributo(atributo: AtributoPredefinido): void {
    this.valoresAtributos.update((lista) => [
      ...lista,
      { atributo, valor: '' },
    ]);
  }

  // ===== ACTUALIZAR VALOR =====
  actualizarValor(index: number, valor: string): void {
    this.valoresAtributos.update((lista) => {
      const nueva = [...lista];
      nueva[index] = { ...nueva[index], valor };
      return nueva;
    });
  }

  // ===== ELIMINAR ATRIBUTO =====
  eliminarAtributo(index: number): void {
    const valor = this.valoresAtributos()[index];
    if (
      confirm(
        `¿Estás seguro de eliminar el atributo "${valor.atributo.nombre}"?`
      )
    ) {
      this.valoresAtributos.update((lista) =>
        lista.filter((_, i) => i !== index)
      );
      this.toastr.success('Atributo eliminado correctamente');
    }
  }

  // ===== MANEJO DE INPUTS =====
  onValorChange(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.actualizarValor(index, input.value);
  }

  // ===== UTILIDADES (Delegadas a funciones importadas) =====
  obtenerTipoInput = obtenerTipoInput;
  obtenerPlaceholder = obtenerPlaceholder;
  obtenerIcono = obtenerIconoAtributo;
  formatearNombre = formatearNombreAtributo;

  trackByIndex(index: number): number {
    return index;
  }

  marcarTodoComoTocado(): void {
    // Opcional
  }
}
