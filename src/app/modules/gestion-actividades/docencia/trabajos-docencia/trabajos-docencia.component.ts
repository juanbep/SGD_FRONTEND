import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ACTIVIDADES_METADATA } from '../../config/actividades-metadata.config';
import {
  ActividadEnMemoria,
  CreateActividadDto,
} from '../../models/actividad.model';
import { ModalActividadComponent } from '../../shared/modal-actividad/modal-actividad/modal-actividad.component';

@Component({
  selector: 'app-trabajos-docencia',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalActividadComponent],
  templateUrl: './trabajos-docencia.component.html',
  styleUrl: './trabajos-docencia.component.css',
})
export class TrabajosDocenciaComponent {
  // Metadata del subtipo
  readonly metadata = ACTIVIDADES_METADATA['TRABAJOS_DOCENCIA'];

  // Atributos que se muestran en la tabla
  readonly atributosTabla = computed(() =>
    this.metadata.atributos
      .filter((attr) => attr.mostrarEnTabla)
      .sort((a, b) => a.orden - b.orden)
  );

  // Estados
  readonly calendarioSeleccionado = signal<number | null>(null);
  readonly actividadesEnMemoria = signal<ActividadEnMemoria[]>([]);
  readonly modalVisible = signal(false);
  readonly actividadAEditar = signal<ActividadEnMemoria | null>(null);
  readonly guardandoTodas = signal(false);

  readonly nombreCalendarioSeleccionado = computed(() => {
    const oid = this.calendarioSeleccionado();
    if (!oid) return '';
    const calendario = this.calendarios.find((c) => c.oid === oid);
    return calendario?.nombre || '';
  });

  // Datos de ejemplo para calendario (reemplazar con el servicio)
  readonly calendarios = [
    { oid: 1, nombre: '2024-2 - Calendario Principal' },
    { oid: 2, nombre: '2025-1 - Calendario Académico' },
  ];

  seleccionarCalendario(oidCalendario: number): void {
    this.calendarioSeleccionado.set(oidCalendario);
  }

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

  agregarActividad(actividad: ActividadEnMemoria): void {
    const actividades = this.actividadesEnMemoria();
    const nuevaActividad = {
      ...actividad,
      id: `temp_${Date.now()}_${Math.random()}`,
      oidCalendario: this.calendarioSeleccionado()!,
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
      // Transformar actividades al formato del backend (quitar IDs temporales)
      const payload: CreateActividadDto[] = actividades.map(
        ({ id, ...actividad }) => actividad
      );

      console.log('Payload a enviar:', JSON.stringify(payload, null, 2));

      // Aquí llamarías a tu servicio
      // await this.actividadService.crearMultiples(payload);

      // Simulación de éxito
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
