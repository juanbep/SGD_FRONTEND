import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ACTIVIDADES_METADATA } from '../../config/actividades-metadata.config';
import {
  ActividadEnMemoria,
  CreateActividadDto,
} from '../../models/actividad.model';
import { ModalActividadComponent } from '../../shared/modal-actividad/modal-actividad/modal-actividad.component';
import { ModalSelectorCalendarioComponent } from '../../shared/modal-actividad/modal-selector-calendario/modal-selector-calendario.component';

export interface Calendario {
  value: number;
  label: string;
  estado: string;
}

@Component({
  selector: 'app-trabajos-docencia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalActividadComponent,
    ModalSelectorCalendarioComponent,
  ],
  templateUrl: './trabajos-docencia.component.html',
  styleUrl: './trabajos-docencia.component.css',
})
export class TrabajosDocenciaComponent {
  readonly metadata = ACTIVIDADES_METADATA['TRABAJOS_DOCENCIA'];

  readonly atributosTabla = computed(() =>
    this.metadata.atributos
      .filter((attr) => attr.mostrarEnTabla)
      .sort((a, b) => a.orden - b.orden)
  );

  // Estados
  readonly calendarioSeleccionado = signal<Calendario | null>(null);
  readonly mostrarModalCalendario = signal(false); // CAMBIAR A FALSE
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

      // Aquí llamarías a tu servicio
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
