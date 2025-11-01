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
  MAX_ESTUDIANTES,
  ATRIBUTO_REPETIBLE,
} from '../../../../utils/actividad-utils';

// Valor ingresado por el usuario
interface ValorAtributo {
  atributo: AtributoPredefinido;
  valor: string;
  indice?: number; // Para atributos repetibles (ej: Estudiante 1, 2, 3...)
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
  readonly MAX_ESTUDIANTES = MAX_ESTUDIANTES;
  readonly ATRIBUTO_REPETIBLE = ATRIBUTO_REPETIBLE;

  // ===== SIGNALS =====
  readonly valoresAtributos = signal<ValorAtributo[]>([]);
  readonly tocado = signal<boolean>(false);

  // ===== COMPUTED =====
  readonly formularioValido = computed(() => {
    const valores = this.valoresAtributos();

    // Si no hay atributos, es válido (opcional)
    if (valores.length === 0) {
      return true;
    }

    // Si hay atributos, todos deben tener valor no vacío
    return valores.every((v) => v.valor.trim() !== '');
  });

  readonly hayAtributos = computed(() => {
    return this.valoresAtributos().length > 0;
  });

  readonly cantidadEstudiantes = computed(() => {
    return this.valoresAtributos().filter(
      (v) => v.atributo.nombre === ATRIBUTO_REPETIBLE
    ).length;
  });

  readonly puedeAgregarEstudiante = computed(() => {
    return this.cantidadEstudiantes() < this.MAX_ESTUDIANTES;
  });

  readonly atributosDisponibles = computed(() => {
    const agregados = this.valoresAtributos().map((v) => v.atributo.nombre);

    return ATRIBUTOS_DISPONIBLES.filter((a) => {
      // El atributo repetible siempre está disponible (hasta el límite)
      if (a.nombre === ATRIBUTO_REPETIBLE) {
        return this.puedeAgregarEstudiante();
      }
      // Los demás solo si no han sido agregados
      return !agregados.includes(a.nombre);
    });
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
      const valores: ValorAtributo[] = [];
      let contadorEstudiantes = 0;

      this.atributos.forEach((dto) => {
        const atributo = ATRIBUTOS_DISPONIBLES.find(
          (a) => a.nombre === dto.nombre
        );

        if (atributo) {
          if (atributo.nombre === ATRIBUTO_REPETIBLE) {
            contadorEstudiantes++;
            valores.push({
              atributo,
              valor: dto.valor,
              indice: contadorEstudiantes,
            });
          } else {
            valores.push({ atributo, valor: dto.valor });
          }
        }
      });

      this.valoresAtributos.set(valores);
    }
  }

  // ===== AGREGAR ATRIBUTO =====
  agregarAtributo(atributo: AtributoPredefinido): void {
    // Si es el atributo repetible, calcular el índice
    if (atributo.nombre === ATRIBUTO_REPETIBLE) {
      const indice = this.cantidadEstudiantes() + 1;

      this.valoresAtributos.update((lista) => [
        ...lista,
        { atributo, valor: '', indice },
      ]);
    } else {
      this.valoresAtributos.update((lista) => [
        ...lista,
        { atributo, valor: '' },
      ]);
    }

    // Resetear el estado tocado cuando se agrega un nuevo atributo
    this.tocado.set(false);
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
    const nombreMostrar = this.obtenerNombreConIndice(valor);

    if (confirm(`¿Estás seguro de eliminar el atributo "${nombreMostrar}"?`)) {
      this.valoresAtributos.update((lista) => {
        const nueva = lista.filter((_, i) => i !== index);

        // Recalcular índices de estudiantes
        return nueva.map((v) => {
          if (v.atributo.nombre === ATRIBUTO_REPETIBLE) {
            const estudiantesAnteriores = nueva.filter(
              (item) =>
                item.atributo.nombre === ATRIBUTO_REPETIBLE &&
                nueva.indexOf(item) <= nueva.indexOf(v)
            );
            return { ...v, indice: estudiantesAnteriores.length };
          }
          return v;
        });
      });

      this.toastr.success('Atributo eliminado correctamente');
      this.tocado.set(false);
    }
  }

  // ===== MANEJO DE INPUTS =====
  onValorChange(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.actualizarValor(index, input.value);
  }

  // ===== UTILIDADES =====
  obtenerNombreConIndice(valorAtributo: ValorAtributo): string {
    if (
      valorAtributo.atributo.nombre === ATRIBUTO_REPETIBLE &&
      valorAtributo.indice
    ) {
      return `${this.formatearNombre(valorAtributo.atributo.nombre)} ${valorAtributo.indice}`;
    }
    return this.formatearNombre(valorAtributo.atributo.nombre);
  }

  obtenerTipoInput = obtenerTipoInput;
  obtenerPlaceholder = obtenerPlaceholder;
  obtenerIcono = obtenerIconoAtributo;
  formatearNombre = formatearNombreAtributo;

  trackByIndex(index: number): number {
    return index;
  }

  marcarTodoComoTocado(): void {
    this.tocado.set(true);
  }
}
