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
import { ModalUsuariosComponent } from '../../../../activities-module-management/components/explore-activities-component/modal-usuarios/modal-usuarios.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ActividadHelperService } from '../../../../activities-module-management/services';
import { ToastrService } from 'ngx-toastr';
import {
  ESTADOS_ACTIVIDAD,
  getEstadoBadgeClass,
  getEstadoNombre,
} from '../../../../activities-module-management/utils/actividad-utils';

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
    NgSelectModule,
  ],
  templateUrl: './gestion-actividad-base.component.html',
  styleUrl: './gestion-actividad-base.component.css',
})
export class GestionActividadBaseComponent {
  private readonly calendarioService = inject(CalendarioHelperService);
  private readonly actividadHelperService = inject(ActividadHelperService);
  private readonly toastr = inject(ToastrService);

  getEstadoBadgeClassFn = getEstadoBadgeClass;

  @Input({ required: true }) metadata!: SubtipoActividadConfig;

  readonly atributosTabla = computed(() =>
    this.metadata.atributos
      .filter((attr) => attr.mostrarEnTabla)
      .sort((a, b) => a.orden - b.orden)
  );

  // Computed para detectar si tiene atributos repetibles
  readonly tieneAtributosRepetibles = computed(() =>
    this.metadata.atributos.some((a) => a.esRepetible)
  );

  // Obtener el título de la columna de grupos repetibles
  readonly tituloColumnaRepetibles = computed(() => {
    const gruposConfig = this.metadata.gruposRepetibles || [];

    if (gruposConfig.length === 0) return 'Detalles';
    if (gruposConfig.length === 1) return gruposConfig[0].labelPlural;

    // Si hay múltiples grupos, mostrar "Detalles" o concatenar nombres
    return 'Detalles';
  });

  // Estados
  readonly calendarios = signal<Calendario[]>([]);
  readonly calendarioSeleccionado = signal<number | null>(null);
  readonly cargandoCalendarios = signal(true);
  readonly actividadesEnMemoria = signal<ActividadEnMemoria[]>([]);
  readonly modalVisible = signal(false);
  readonly actividadAEditar = signal<ActividadEnMemoria | null>(null);
  readonly guardandoTodas = signal(false);
  readonly guardandoIndividual = signal<string | null>(null);
  readonly estadosActividad = ESTADOS_ACTIVIDAD;

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

  readonly calendariosDisponibles = computed(() =>
    this.calendarios().filter((c) => c.estado !== 'DESHABILITADO')
  );

  readonly puedeAgregarActividades = computed(
    () => this.calendarioSeleccionado() !== null
  );

  readonly totalColumnas = computed(() => {
    let total = 6; // # + Nombre + Semanas + Estado + Usuarios + Acciones
    total += this.atributosTabla().length; // Atributos dinámicos
    total += this.metadata.gruposRepetibles?.length || 0; // Una columna por grupo
    return total;
  });

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

  // Obtener resumen de UN grupo específico
  obtenerResumenGrupo(
    actividad: ActividadEnMemoria,
    nombreGrupo: string
  ): string {
    const grupos = actividad.atributosRepetibles;
    if (!grupos || grupos.length === 0) return '-';

    const grupoData = grupos.find((g) => g.grupo === nombreGrupo);
    if (!grupoData || grupoData.items.length === 0) return '-';

    // Obtener configuración del grupo desde metadata
    const configGrupo = this.metadata.gruposRepetibles?.find(
      (g) => g.nombre === nombreGrupo
    );
    if (!configGrupo) return '-';

    const total = grupoData.items.length;
    const primerItem = grupoData.items[0];

    // Buscar los campos según el orden definido en camposMostrar
    let textoMostrar = '';
    for (const campo of configGrupo.camposMostrar) {
      const valor = primerItem.find((a) => a.nombre === campo)?.valor;
      if (valor) {
        textoMostrar = textoMostrar ? `${textoMostrar} (${valor})` : valor;
      }
    }

    // Construir resumen
    if (total === 1) {
      return textoMostrar || `1 ${configGrupo.labelSingular}`;
    }
    return `${textoMostrar} +${total - 1} más`;
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
    return getEstadoNombre(oid);
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

      // Usar el helper con el nuevo retorno
      const resultado = await this.actividadHelperService.createMultiple(
        payload
      );

      console.log('Respuesta del backend:', resultado);

      // Construir mensaje según resultados
      let mensaje = '';
      if (resultado.exitosas.length === resultado.total) {
        // Todas exitosas
        mensaje = `¡${resultado.total} actividades guardadas exitosamente!`;
      } else if (resultado.exitosas.length === 0) {
        // Todas fallaron
        mensaje = `Error: No se pudo guardar ninguna actividad.\n\n${resultado.fallidas
          .map((f) => `Actividad ${f.indice + 1}: ${f.mensaje}`)
          .join('\n')}`;
      } else {
        // Algunas exitosas, algunas fallidas
        mensaje = `Se guardaron ${resultado.exitosas.length} de ${resultado.total} actividades.\n\n`;
        mensaje += `Fallidas:\n${resultado.fallidas
          .map((f) => `Actividad ${f.indice + 1}: ${f.mensaje}`)
          .join('\n')}`;
      }

      alert(mensaje);

      // Limpiar solo si todas fueron exitosas
      if (resultado.exitosas.length === resultado.total) {
        this.actividadesEnMemoria.set([]);
      }
    } catch (error: any) {
      console.error('Error al guardar actividades:', error);
      const mensaje = error?.message || 'Error al guardar las actividades';
      alert(mensaje);
    } finally {
      this.guardandoTodas.set(false);
    }
  }

  // Guardar actividad individual
  async guardarActividad(actividad: ActividadEnMemoria): Promise<void> {
    if (!actividad.id) return;

    this.guardandoIndividual.set(actividad.id);

    try {
      const { id, atributosRepetibles, ...resto } = actividad;

      const atributos = [...resto.atributos];

      // 2. Si hay atributosRepetibles, los aplanamos
      if (atributosRepetibles && atributosRepetibles.length > 0) {
        for (const grupo of atributosRepetibles) {
          grupo.items.forEach((item) => {
            item.forEach((attr) => {
              atributos.push({
                nombre: attr.nombre,
                tipo: attr.tipo,
                valor: attr.valor,
              });
            });
          });
        }
      }

      const payload: CreateActividadDto = {
        ...resto, // oidTipoActividad, oidEstadoActividad, nombreActividad, semanas, oidCalendario, usuarios
        atributos, // atributos ya combinados (simples + repetibles)
        // SIN atributosRepetibles
      };

      console.log('Payload a enviar:', JSON.stringify(payload, null, 2));

      const response = await this.actividadHelperService.create(payload);
      console.log('Respuesta del backend:', response);

      if (response) {
        this.toastr.success('Actividad guardada exitosamente');
        this.eliminarActividad(actividad.id);
      } else {
        this.toastr.error('No se recibió respuesta del servidor');
      }
    } catch (error: any) {
      console.error('Error al guardar actividad:', error);

      const mensajeBackend =
        error?.error?.mensaje ||
        error?.message ||
        'Error al guardar la actividad';

      this.toastr.error(mensajeBackend);
    } finally {
      this.guardandoIndividual.set(null);
    }
  }

  estaGuardando(id: string): boolean {
    return this.guardandoIndividual() === id;
  }
}
