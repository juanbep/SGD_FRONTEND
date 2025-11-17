import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalActividadComponent } from '../modal-actividad/modal-actividad.component';
import { ModalSelectorCalendarioComponent } from '../modal-selector-calendario/modal-selector-calendario.component';
import {
  ActividadEnMemoria,
  CreateActividadDto,
} from '../../../models/actividad.model';
import { SubtipoActividadConfig } from '../../../config/actividades-metadata.config';

export interface Calendario {
  value: number;
  label: string;
  estado: string;
}

@Component({
  selector: 'app-gestion-actividad-base',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalActividadComponent,
    ModalSelectorCalendarioComponent,
  ],
  templateUrl: './gestion-actividad-base.component.html',
  styleUrl: './gestion-actividad-base.component.css',
})
export class GestionActividadBaseComponent {
  @Input({ required: true }) metadata!: SubtipoActividadConfig;

  readonly atributosTabla = computed(() =>
    this.metadata.atributos
      .filter((attr) => attr.mostrarEnTabla)
      .sort((a, b) => a.orden - b.orden)
  );

  // Estados
  readonly calendarioSeleccionado = signal<Calendario | null>(null);
  readonly mostrarModalCalendario = signal(false);
  readonly actividadesEnMemoria = signal<ActividadEnMemoria[]>([]);
  readonly modalVisible = signal(false);
  readonly actividadAEditar = signal<ActividadEnMemoria | null>(null);
  readonly guardandoTodas = signal(false);

  readonly nombreCalendarioSeleccionado = computed(() => {
    const calendario = this.calendarioSeleccionado();
    return calendario?.label || '';
  });

  // Modal Calendario
  abrirModalCalendario(): void {
    this.mostrarModalCalendario.set(true);
  }

  onSeleccionarCalendario(calendario: Calendario): void {
    this.calendarioSeleccionado.set(calendario);
    this.mostrarModalCalendario.set(false);
  }

  cerrarModalCalendario(): void {
    this.mostrarModalCalendario.set(false);
  }

  // Modal Actividad
  abrirModalAgregar(): void {
    this.actividadAEditar.set(null);
    this.modalVisible.set(true);
  }

  abrirModalEditar(actividad: ActividadEnMemoria): void {
    this.actividadAEditar.set({ ...actividad });
    this.modalVisible.set(true);
  }

  cerrarModal(): void {
    this.modalVisible.set(false);
    this.actividadAEditar.set(null);
  }

  // CRUD Actividades
  agregarActividad(actividad: ActividadEnMemoria): void {
    const actividades = this.actividadesEnMemoria();
    const nuevaActividad = {
      ...actividad,
      id: `temp_${Date.now()}_${Math.random()}`,
      oidCalendario: this.calendarioSeleccionado()!.value,
    };
    this.actividadesEnMemoria.set([...actividades, nuevaActividad]);
  }

  actualizarActividad(actividad: ActividadEnMemoria): void {
    const actividades = this.actividadesEnMemoria();
    const index = actividades.findIndex((a) => a.id === actividad.id);
    if (index !== -1) {
      const nuevasActividades = [...actividades];
      nuevasActividades[index] = actividad;
      this.actividadesEnMemoria.set(nuevasActividades);
    }
  }

  eliminarActividad(id: string): void {
    const actividades = this.actividadesEnMemoria();
    this.actividadesEnMemoria.set(actividades.filter((a) => a.id !== id));
  }

  obtenerValorAtributo(
    actividad: ActividadEnMemoria,
    nombreAtributo: string
  ): string {
    const atributo = actividad.atributos.find(
      (a) => a.nombre === nombreAtributo
    );
    return atributo?.valor || '-';
  }

  obtenerNombreEstado(oid: number): string {
    return oid === 1 ? 'Inactiva' : 'Activa';
  }

  async guardarTodas(): Promise<void> {
    const actividades = this.actividadesEnMemoria();
    if (actividades.length === 0) {
      alert('No hay actividades para guardar');
      return;
    }

    this.guardandoTodas.set(true);

    try {
      const payload: CreateActividadDto[] = actividades.map(
        ({ id, ...actividad }) => actividad
      );

      console.log('Payload a enviar:', JSON.stringify(payload, null, 2));

      // Implementar servicio
      // await this.actividadService.crearMultiples(payload);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('¡Actividades guardadas exitosamente!');
      this.actividadesEnMemoria.set([]);
    } catch (error) {
      console.error('Error al guardar actividades:', error);
      alert('Error al guardar las actividades');
    } finally {
      this.guardandoTodas.set(false);
    }
  }
}
