import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { UsuarioActividadAsignacion, ValidarCupoData } from '../../../models';
import { UsuarioDepartamentoHelperService } from '../../../../gestion-usuarios/services';
import {
  CargosActividadHelperService,
  UsuarioActividadCalendarioHelperService,
} from '../../../services';
import { getUserDepartmentId } from '../../../../auth/utils/user-storage.utils';

interface UsuarioSelect {
  oid: number;
  label: string;
}

interface CargoSelect {
  oid: number;
  nombre: string;
}

export interface NuevoUsuarioDTO {
  oidUsuario: number;
  oidCargoActividad: number;
  horas: number;
}

@Component({
  selector: 'app-formulario-asignar-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './formulario-asignar-usuario.component.html',
  styleUrl: './formulario-asignar-usuario.component.css',
})
export class FormularioAsignarUsuarioComponent implements OnInit {
  @Input() oidTipoActividad!: number;
  @Input() usuariosYaAsignados: UsuarioActividadAsignacion[] = [];
  @Input() oidCalendario!: number;

  @Output() onUsuarioListo = new EventEmitter<NuevoUsuarioDTO>();
  @Output() onCancelar = new EventEmitter<void>();

  private usuarioService = inject(UsuarioDepartamentoHelperService);
  private cargoService = inject(CargosActividadHelperService);
  private validacionService = inject(UsuarioActividadCalendarioHelperService);
  private toastr = inject(ToastrService);

  // Estados de carga
  cargandoUsuarios: boolean = false;
  cargandoCargos: boolean = false;
  cargandoDatos: boolean = false;

  // ========== PROPIEDADES PARA VALIDACIÓN ==========
  validando: boolean = false;
  validacionRealizada: boolean = false;
  datosValidacion: ValidarCupoData | null = null;
  maxHorasPermitidas: number = 999; // Valor por defecto

  // Dropdowns
  usuariosDisponibles: UsuarioSelect[] = [];
  cargosDisponibles: CargoSelect[] = [];

  // Modelo del formulario
  usuarioSeleccionado: number | null = null;
  cargoSeleccionado: number | null = null;
  horasAsignadas: number = 0;

  ngOnInit(): void {
    this.cargarDatos();
  }

  private async cargarDatos(): Promise<void> {
    this.cargandoDatos = true;

    await Promise.all([this.cargarUsuarios(), this.cargarCargos()]);

    this.cargandoDatos = false;
  }

  private async cargarUsuarios(): Promise<void> {
    this.cargandoUsuarios = true;
    try {
      const oidDepartamento = getUserDepartmentId();

      const usuarios = await this.usuarioService.getAll({
        page: 0,
        size: 1000,
        oidDepartamento,
      });

      // Filtrar usuarios ya asignados
      const idsAsignados = this.usuariosYaAsignados.map((ua) => ua.oidUsuario);

      const usuariosFiltrados = usuarios
        .filter((u) => !idsAsignados.includes(u.usuario.oidUsuario))
        .map((u) => ({
          oid: u.usuario.oidUsuario,
          label: `${u.usuario.nombres} ${u.usuario.apellidos} (${u.usuario.identificacion})`,
        }));

      this.usuariosDisponibles = usuariosFiltrados;
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.toastr.error('Error al cargar la lista de usuarios');
      this.usuariosDisponibles = [];
    } finally {
      this.cargandoUsuarios = false;
    }
  }

  private async cargarCargos(): Promise<void> {
    this.cargandoCargos = true;
    try {
      const cargos = await this.cargoService.getAll({
        page: 0,
        size: 1000,
        oidTipoActividad: this.oidTipoActividad,
      });

      this.cargosDisponibles = cargos.map((c) => ({
        oid: c.oidCargoActividad,
        nombre: c.nombre,
      }));
    } catch (error) {
      console.error('Error al cargar cargos:', error);
      this.toastr.error('Error al cargar la lista de cargos');
      this.cargosDisponibles = [];
    } finally {
      this.cargandoCargos = false;
    }
  }

  validarFormulario(): boolean {
    if (!this.usuarioSeleccionado) {
      this.toastr.warning('Debe seleccionar un usuario');
      return false;
    }
    if (!this.cargoSeleccionado) {
      this.toastr.warning('Debe seleccionar un cargo');
      return false;
    }
    if (this.horasAsignadas <= 0) {
      this.toastr.warning('Las horas deben ser mayor a 0');
      return false;
    }
    return true;
  }

  // ========== MÉTODO DE VALIDACIÓN ==========
  async validarCupoUsuario(): Promise<void> {
    // Solo validar si hay usuario Y cargo seleccionados
    if (!this.usuarioSeleccionado || !this.cargoSeleccionado) {
      this.validacionRealizada = false;
      this.datosValidacion = null;
      this.maxHorasPermitidas = 999;
      return;
    }

    this.validando = true;
    this.validacionRealizada = false;

    try {
      const resultado = await this.validacionService.validarCupo({
        oidTipoActividad: this.oidTipoActividad,
        oidCargoActividad: this.cargoSeleccionado,
        oidCalendario: this.oidCalendario,
        oidUsuario: this.usuarioSeleccionado,
      });

      if (resultado) {
        this.datosValidacion = resultado;
        this.validacionRealizada = true;

        // Actualizar el máximo de horas permitidas
        this.maxHorasPermitidas = resultado.horasDisponiblesUsuarioMenorCupo;

        // Si las horas actuales exceden el límite, ajustarlas
        if (this.horasAsignadas > this.maxHorasPermitidas) {
          this.horasAsignadas = this.maxHorasPermitidas;
        }
      }
    } catch (error) {
      console.error('Error al validar cupo:', error);
      this.toastr.error('Error al validar disponibilidad del usuario');
      this.validacionRealizada = false;
      this.datosValidacion = null;
    } finally {
      this.validando = false;
    }
  }

  confirmar(): void {
    if (
      this.usuarioSeleccionado &&
      this.cargoSeleccionado &&
      this.horasAsignadas > 0
    ) {
      // Validación adicional: verificar que puede asignar
      if (this.validacionRealizada && !this.datosValidacion?.puedeAsignar) {
        this.toastr.warning(
          'El usuario no tiene cupo disponible para este cargo'
        );
        return;
      }

      this.onUsuarioListo.emit({
        oidUsuario: this.usuarioSeleccionado,
        oidCargoActividad: this.cargoSeleccionado,
        horas: this.horasAsignadas,
      });

      // Limpiar validación después de confirmar
      this.limpiarValidacion();
    }
  }

  cancelar(): void {
    this.limpiarValidacion();
    this.onCancelar.emit();
  }

  private limpiarValidacion(): void {
    this.validando = false;
    this.validacionRealizada = false;
    this.datosValidacion = null;
    this.maxHorasPermitidas = 999;
  }

  resetear(): void {
    this.usuarioSeleccionado = null;
    this.cargoSeleccionado = null;
    this.horasAsignadas = 0;
  }
}
