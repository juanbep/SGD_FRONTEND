import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import {
  ActividadEnMemoria,
  AtributoActividad,
  AtributoRepetible,
  UsuarioActividad,
} from '../../../models/actividad.model';
import {
  AtributoMetadata,
  SubtipoActividadConfig,
} from '../../../config/actividades-metadata.config';
import { UsuarioDepartamentoHelperService } from '../../../../sgd-users-management/services';
import { getUserDepartmentId } from '../../../../auth/utils/user-storage.utils';
import { CargosActividadHelperService } from '../../../../activities-module-management/services';
import {
  ESTADOS_ACTIVIDAD,
  ESTADOS_ACTIVIDAD_DROPDOWN,
} from '../../../../activities-module-management/utils/actividad-utils';
import { NgSelectModule } from '@ng-select/ng-select';

interface UsuarioSelect {
  oid: number;
  label: string;
  identificacion: string;
}

interface CargoSelect {
  oid: number;
  nombre: string;
}

@Component({
  selector: 'app-modal-actividad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule],
  templateUrl: './modal-actividad.component.html',
  styleUrl: './modal-actividad.component.css',
})
export class ModalActividadComponent implements OnInit {
  @Input() visible = false;
  @Input() metadata!: SubtipoActividadConfig;
  @Input() actividadAEditar: ActividadEnMemoria | null = null;
  @Output() onGuardar = new EventEmitter<ActividadEnMemoria>();
  @Output() onCancelar = new EventEmitter<void>();

  actividadForm!: FormGroup;
  readonly agregarOtra = signal(true);
  readonly modoEdicion = signal(false);
  readonly estadosActividad = ESTADOS_ACTIVIDAD_DROPDOWN;

  // ========== SERVICIOS ==========
  private usuarioService = inject(UsuarioDepartamentoHelperService);
  private cargoService = inject(CargosActividadHelperService);

  // Usuarios
  readonly usuariosDisponibles = signal<UsuarioSelect[]>([]);
  readonly cargandoUsuarios = signal(true);
  readonly usuariosAsignados = signal<UsuarioActividad[]>([]);

  // Estructura: { nombreGrupo: { campos: {nombreCampo: valor}[] } }
  readonly gruposRepetiblesData = signal<{
    [nombreGrupo: string]: { [nombreCampo: string]: string }[];
  }>({});
  camposTemporales: {
    [nombreGrupo: string]: { [nombreCampo: string]: string };
  } = {};

  //Cargos
  readonly cargosDisponibles = signal<CargoSelect[]>([]);
  readonly cargandoCargos = signal(true);

  usuarioSeleccionado: number | null = null;
  readonly cargoSeleccionado = signal<number | null>(null);
  horasUsuario: number | null = null;

  readonly contadorUsuarios = computed(() => {
    const count = this.usuariosAsignados().length;
    if (count === 0) return '';
    return `${count} usuario${count > 1 ? 's' : ''} agregado${
      count > 1 ? 's' : ''
    }`;
  });

  readonly gruposRepetiblesConfig = computed(() => {
    const grupos: {
      [nombreGrupo: string]: AtributoMetadata[];
    } = {};

    this.metadata.atributos
      .filter((a) => a.esRepetible && a.grupoRepetible)
      .forEach((attr) => {
        const grupo = attr.grupoRepetible!;
        if (!grupos[grupo]) {
          grupos[grupo] = [];
        }
        grupos[grupo].push(attr);
      });

    return grupos;
  });

  // Verificar si tiene al menos un grupo repetible
  readonly tieneGruposRepetibles = computed(() => {
    return Object.keys(this.gruposRepetiblesConfig()).length > 0;
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarUsuarios();
    this.cargarCargos();

    if (this.actividadAEditar) {
      this.modoEdicion.set(true);
      this.cargarDatosActividad(this.actividadAEditar);
    }
  }

  // ========== NUEVO MÉTODO ==========
  private async cargarUsuarios(): Promise<void> {
    this.cargandoUsuarios.set(true);
    try {
      const oidDepartamentoActual = getUserDepartmentId();

      const usuarios = await this.usuarioService.getAll({
        page: 0,
        size: 1000, // Traer todos los usuarios
        oidDepartamento: oidDepartamentoActual,
      });

      const usuariosFormateados = usuarios.map((u) => ({
        oid: u.usuario.oidUsuario,
        label: `${u.usuario.nombres} ${u.usuario.apellidos} (ID: ${u.usuario.identificacion})`,
        identificacion: u.usuario.identificacion,
      }));

      this.usuariosDisponibles.set(usuariosFormateados);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      this.cargandoUsuarios.set(false);
    }
  }

  private async cargarCargos(): Promise<void> {
    this.cargandoCargos.set(true);
    try {
      const cargos = await this.cargoService.getAll({
        page: 0,
        size: 1000,
        oidTipoActividad: this.metadata.oidTipoActividad,
      });

      const cargosFormateados = cargos.map((c) => ({
        oid: c.oidCargoActividad,
        nombre: c.nombre,
      }));

      this.cargosDisponibles.set(cargosFormateados);
    } catch (error) {
      console.error('Error al cargar cargos:', error);
    } finally {
      this.cargandoCargos.set(false);
    }
  }

  // ========== NUEVO MÉTODO ==========
  agregarUsuario(): void {
    if (
      !this.usuarioSeleccionado ||
      !this.cargoSeleccionado ||
      !this.horasUsuario
    ) {
      alert('Por favor complete todos los campos del usuario');
      return;
    }

    if (this.horasUsuario <= 0) {
      alert('Las horas deben ser mayor a 0');
      return;
    }

    const usuariosActuales = this.usuariosAsignados();
    if (
      usuariosActuales.some((u) => u.oidUsuario === this.usuarioSeleccionado)
    ) {
      alert('Este usuario ya ha sido agregado a la actividad');
      return;
    }

    const nuevoUsuario: UsuarioActividad = {
      oidUsuario: this.usuarioSeleccionado,
      oidCargoActividad: this.cargoSeleccionado()!,
      horas: this.horasUsuario,
    };

    this.usuariosAsignados.set([...usuariosActuales, nuevoUsuario]);

    this.usuarioSeleccionado = null;
    this.cargoSeleccionado.set(null);
    this.horasUsuario = null;
  }
  // ===================================

  private inicializarFormulario(): void {
    const formConfig: any = {
      nombreActividad: ['', [Validators.required, Validators.minLength(3)]],
      semanas: [16, [Validators.required, Validators.min(1)]],
      oidEstadoActividad: [2, Validators.required],
    };

    this.metadata.atributos
      .filter((attr) => !attr.esRepetible)
      .forEach((attr) => {
        const validators = [];
        if (attr.requerido) {
          validators.push(Validators.required);
        }
        if (attr.validaciones?.minLength) {
          validators.push(Validators.minLength(attr.validaciones.minLength));
        }
        if (attr.validaciones?.maxLength) {
          validators.push(Validators.maxLength(attr.validaciones.maxLength));
        }
        if (attr.validaciones?.min) {
          validators.push(Validators.min(attr.validaciones.min));
        }
        if (attr.validaciones?.max) {
          validators.push(Validators.max(attr.validaciones.max));
        }
        if (attr.validaciones?.pattern) {
          validators.push(Validators.pattern(attr.validaciones.pattern));
        }

        formConfig[attr.nombre] = ['', validators];
      });

    this.actividadForm = this.fb.group(formConfig);
  }

  private cargarDatosActividad(actividad: ActividadEnMemoria): void {
    this.actividadForm.patchValue({
      nombreActividad: actividad.nombreActividad,
      semanas: actividad.semanas,
      oidEstadoActividad: actividad.oidEstadoActividad,
    });

    // Cargar atributos simples
    actividad.atributos.forEach((attr) => {
      const control = this.actividadForm.get(attr.nombre);
      if (control) {
        control.setValue(attr.valor);
      }
    });

    // Cargar usuarios
    if (actividad.usuarios) {
      this.usuariosAsignados.set([...actividad.usuarios]);
    }

    // Cargar grupos repetibles - 100% GENÉRICO
    if (actividad.atributosRepetibles) {
      const datosGrupos: {
        [nombreGrupo: string]: { [nombreCampo: string]: string }[];
      } = {};

      for (const grupoData of actividad.atributosRepetibles) {
        datosGrupos[grupoData.grupo] = grupoData.items.map((item) => {
          const itemObj: { [nombreCampo: string]: string } = {};
          item.forEach((attr) => {
            itemObj[attr.nombre] = attr.valor;
          });
          return itemObj;
        });
      }

      this.gruposRepetiblesData.set(datosGrupos);
    }
  }

  confirmar(): void {
    if (this.actividadForm.invalid) {
      this.actividadForm.markAllAsTouched();
      return;
    }

    // Validar grupos repetibles requeridos
    const gruposConfig = this.metadata.gruposRepetibles || [];
    const datosGrupos = this.gruposRepetiblesData();

    for (const configGrupo of gruposConfig) {
      const items = datosGrupos[configGrupo.nombre] || [];
      if (items.length === 0) {
        // Si hay al menos un campo requerido en el grupo, el grupo es requerido
        const tieneRequeridos = this.metadata.atributos
          .filter((a) => a.grupoRepetible === configGrupo.nombre)
          .some((a) => a.requerido);

        if (tieneRequeridos) {
          alert(`Debe agregar al menos un ${configGrupo.labelSingular}`);
          return;
        }
      }
    }

    const formValues = this.actividadForm.value;

    // Atributos simples (no repetibles)
    const atributos: AtributoActividad[] = this.metadata.atributos
      .filter((attr) => !attr.esRepetible)
      .map((attr) => ({
        nombre: attr.nombre,
        tipo: attr.tipoValor,
        valor: formValues[attr.nombre]?.toString() || '',
      }));

    // Atributos repetibles - 100% GENÉRICO
    const atributosRepetibles: AtributoRepetible[] = [];

    for (const nombreGrupo in datosGrupos) {
      const items = datosGrupos[nombreGrupo];
      if (items.length > 0) {
        // Obtener los atributos que pertenecen a este grupo
        const atributosDelGrupo = this.metadata.atributos.filter(
          (a) => a.grupoRepetible === nombreGrupo
        );

        atributosRepetibles.push({
          grupo: nombreGrupo,
          items: items.map((item) =>
            atributosDelGrupo.map((attr) => ({
              nombre: attr.nombre,
              tipo: attr.tipoValor,
              valor: item[attr.nombre] || '',
            }))
          ),
        });
      }
    }

    const actividad: ActividadEnMemoria = {
      ...this.actividadAEditar,
      oidTipoActividad: this.metadata.oidTipoActividad,
      oidEstadoActividad: formValues.oidEstadoActividad,
      nombreActividad: formValues.nombreActividad,
      semanas: formValues.semanas,
      oidCalendario: this.actividadAEditar?.oidCalendario || 0,
      usuarios: this.usuariosAsignados(),
      atributos: atributos,
      atributosRepetibles:
        atributosRepetibles.length > 0 ? atributosRepetibles : undefined,
    };

    this.onGuardar.emit(actividad);

    if (!this.modoEdicion() && this.agregarOtra()) {
      this.resetearFormulario();
    } else {
      this.cancelar();
    }
  }

  cancelar(): void {
    this.onCancelar.emit();
  }

  private resetearFormulario(): void {
    this.actividadForm.reset({
      semanas: 16,
      oidEstadoActividad: 2,
    });

    // Limpiar usuarios
    this.usuariosAsignados.set([]);
    this.usuarioSeleccionado = null;
    this.cargoSeleccionado.set(null);
    this.horasUsuario = null;

    // Limpiar grupos repetibles - GENÉRICO
    this.gruposRepetiblesData.set({});
    this.camposTemporales = {};
  }

  getControl(nombre: string) {
    return this.actividadForm.get(nombre);
  }

  // Agregar item genérico a cualquier grupo
  agregarItemGrupo(nombreGrupo: string): void {
    const camposDelGrupo = this.gruposRepetiblesConfig()[nombreGrupo];
    if (!camposDelGrupo) return;

    // Validar que todos los campos requeridos estén llenos
    const camposTemp = this.camposTemporales[nombreGrupo] || {};

    for (const campo of camposDelGrupo) {
      if (campo.requerido && !camposTemp[campo.nombre]?.trim()) {
        alert(`El campo "${campo.label}" es requerido`);
        return;
      }
    }

    // Obtener datos actuales del grupo
    const datosActuales = this.gruposRepetiblesData();
    const itemsGrupo = datosActuales[nombreGrupo] || [];

    // Agregar el nuevo item
    const nuevoItem = { ...camposTemp };
    this.gruposRepetiblesData.set({
      ...datosActuales,
      [nombreGrupo]: [...itemsGrupo, nuevoItem],
    });

    // Limpiar campos temporales
    this.camposTemporales[nombreGrupo] = {};
  }

  // Eliminar item genérico de cualquier grupo
  eliminarItemGrupo(nombreGrupo: string, index: number): void {
    const datosActuales = this.gruposRepetiblesData();
    const itemsGrupo = datosActuales[nombreGrupo] || [];

    this.gruposRepetiblesData.set({
      ...datosActuales,
      [nombreGrupo]: itemsGrupo.filter((_, i) => i !== index),
    });
  }

  // Obtener contador de items de un grupo
  contadorItemsGrupo(nombreGrupo: string): string {
    const datosActuales = this.gruposRepetiblesData();
    const items = datosActuales[nombreGrupo] || [];
    const count = items.length;

    if (count === 0) return '';

    const config = this.metadata.gruposRepetibles?.find(
      (g) => g.nombre === nombreGrupo
    );
    const label = count === 1 ? config?.labelSingular : config?.labelPlural;

    return `${count} ${label || 'item(s)'} agregado${count > 1 ? 's' : ''}`;
  }

  // Obtener valor temporal de un campo
  obtenerValorTemporal(nombreGrupo: string, nombreCampo: string): string {
    return this.camposTemporales[nombreGrupo]?.[nombreCampo] || '';
  }

  // Actualizar valor temporal
  actualizarValorTemporal(
    nombreGrupo: string,
    nombreCampo: string,
    valor: string
  ): void {
    if (!this.camposTemporales[nombreGrupo]) {
      this.camposTemporales[nombreGrupo] = {};
    }
    this.camposTemporales[nombreGrupo][nombreCampo] = valor;
  }

  // Verificar si se puede agregar (todos los campos requeridos llenos)
  puedeAgregarItem(nombreGrupo: string): boolean {
    const camposDelGrupo = this.gruposRepetiblesConfig()[nombreGrupo];
    if (!camposDelGrupo) return false;

    const camposTemp = this.camposTemporales[nombreGrupo] || {};

    return camposDelGrupo
      .filter((c) => c.requerido)
      .every((c) => camposTemp[c.nombre]?.trim());
  }

  // Devuelve el label del usuario a partir del oid
  getUsuarioLabel(oidUsuario: number): string {
    const usuario = this.usuariosDisponibles().find(
      (u) => u.oid === oidUsuario
    );
    return usuario ? usuario.label : `Usuario ${oidUsuario}`;
  }

  // Devuelve el nombre del cargo a partir del oid
  getCargoNombre(oidCargo: number): string {
    const cargo = this.cargosDisponibles().find((c) => c.oid === oidCargo);
    return cargo ? cargo.nombre : `Cargo ${oidCargo}`;
  }

  eliminarUsuario(index: number): void {
    const actuales = this.usuariosAsignados();
    this.usuariosAsignados.set(actuales.filter((_, i) => i !== index));
  }

  // Función para obtener el label del cargo seleccionado
  cargoSeleccionadoLabel = computed(() => {
    if (!this.cargoSeleccionado()) return null;
    const cargo = this.cargosDisponibles().find(
      (c) => c.oid === this.cargoSeleccionado()
    );
    return cargo?.nombre || null;
  });
}
