import { Component, Input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalActividadComponent } from '../modal-actividad/modal-actividad.component';
import {
  ActividadEnMemoria,
  CreateActividadDto,
} from '../../../models/actividad.model';
import { SubtipoActividadConfig } from '../../../config/actividades-metadata.config';
import { CalendarioHelperService } from '../../../../academic-calendar-management/services';
import { ModalUsuariosComponent } from '../../../../activities-module-management/components/activities-component/explore-activities-component/modal-usuarios/modal-usuarios.component';

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
    ModalUsuariosComponent,
  ],
  templateUrl: './gestion-actividad-base.component.html',
  styleUrl: './gestion-actividad-base.component.css',
})
export class GestionActividadBaseComponent {
  private readonly calendarioService = inject(CalendarioHelperService);

  @Input({ required: true }) metadata!: SubtipoActividadConfig;

  readonly atributosTabla = computed(() =>
    this.metadata.atributos
      .filter((attr) => attr.mostrarEnTabla)
      .sort((a, b) => a.orden - b.orden)
  );

  // Estados
  readonly calendarios = signal<Calendario[]>([]);
  readonly calendarioSeleccionado = signal<number | null>(null);
  readonly cargandoCalendarios = signal(true);
  readonly actividadesEnMemoria = signal<ActividadEnMemoria[]>([]);
  readonly modalVisible = signal(false);
  readonly actividadAEditar = signal<ActividadEnMemoria | null>(null);
  readonly guardandoTodas = signal(false);
  readonly guardandoIndividual = signal<string | null>(null);

  // Modal de usuarios
  readonly mostrarModalUsuarios = signal(false);
  readonly usuariosSeleccionados = signal<number[]>([]);

  readonly nombreCalendarioSeleccionado = computed(() => {
    const oid = this.calendarioSeleccionado();
    if (!oid) return '';
    const calendario = this.calendarios().find((c) => c.value === oid);
    return calendario?.label || '';
  });

  readonly estadoCalendarioSeleccionado = computed(() => {
    const oid = this.calendarioSeleccionado();
    if (!oid) return null;
    const calendario = this.calendarios().find((c) => c.value === oid);
    return calendario?.estado || null;
  });

  readonly puedeAgregarActividades = computed(
    () => this.calendarioSeleccionado() !== null
  );

  async ngOnInit() {
    await this.cargarCalendarios();
  }

  private async cargarCalendarios(): Promise<void> {
    this.cargandoCalendarios.set(true);
    try {
      const calendarios = await this.calendarioService.getAllForDropdown();
      this.calendarios.set(calendarios);
    } catch (error) {
      console.error('Error al cargar calendarios:', error);
    } finally {
      this.cargandoCalendarios.set(false);
    }
  }

  onCalendarioChange(oidCalendario: number | null): void {
    this.calendarioSeleccionado.set(oidCalendario);
    // Limpiar actividades al cambiar de calendario
    if (oidCalendario) {
      this.actividadesEnMemoria.set([]);
    }
  }

  // Modal Actividad
  abrirModalAgregar(): void {
    if (!this.puedeAgregarActividades()) return;
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

  // Modal de Usuarios
  abrirModalUsuarios(usuarios: number[]): void {
    this.usuariosSeleccionados.set(usuarios);
    this.mostrarModalUsuarios.set(true);
  }

  cerrarModalUsuarios(): void {
    this.mostrarModalUsuarios.set(false);
    this.usuariosSeleccionados.set([]);
  }

  // CRUD Actividades
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

  obtenerIdsUsuarios(actividad: ActividadEnMemoria): number[] {
    return actividad.usuarios?.map((u) => u.oidUsuario) || [];
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

      // Aquí se llama al servicio
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

  // Guardar actividad individual
  async guardarActividad(actividad: ActividadEnMemoria): Promise<void> {
    if (!actividad.id) return;

    // Confirmar antes de guardar
    const confirmar = window.confirm(
      `¿Desea guardar la actividad "${actividad.nombreActividad}"?`
    );
    if (!confirmar) return;

    this.guardandoIndividual.set(actividad.id);

    try {
      const { id, ...actividadSinId } = actividad;
      const payload: CreateActividadDto = actividadSinId;

      console.log('Payload individual:', JSON.stringify(payload, null, 2));

      // TODO: Llamar al servicio para guardar individual
      // await this.actividadService.crear(payload);

      // Simular llamada API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert('¡Actividad guardada exitosamente!');

      // Eliminar de la lista local después de guardar
      this.eliminarActividad(actividad.id);
    } catch (error) {
      console.error('Error al guardar actividad:', error);
      alert('Error al guardar la actividad');
    } finally {
      this.guardandoIndividual.set(null);
    }
  }

  estaGuardando(id: string): boolean {
    return this.guardandoIndividual() === id;
  }
}
