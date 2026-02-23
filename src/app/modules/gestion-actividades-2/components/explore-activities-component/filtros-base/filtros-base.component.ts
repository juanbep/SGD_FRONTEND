import { Component, inject, Input, OnInit } from '@angular/core';
import { CalendarioHelperService } from '../../../../gestion-calendarios/services';
import { DepartamentoHelperService } from '../../../../gestion-planes/services';
import { UsuariosConActividadesHelperService } from '../../../../gestion-usuarios/services';
import { ToastrService } from 'ngx-toastr';
import { EstadoCalendario } from '../../../../gestion-calendarios/models';
import {
  esRolEspecial,
  getClasesBotones,
  getClasesCalendario,
  getClasesContratacion,
  getClasesDepartamento,
  getClasesResponsable,
  obtenerRolDocente,
} from '../../../utils/filtros-actividades.utils';
import {
  ordenarCalendariosPorAnio,
  seleccionarCalendarioAutomatico,
} from '../../../utils/actividad-utils';
import { UsuariosConActividadesFilters } from '../../../../gestion-usuarios/models';

@Component({
  selector: 'app-filtros-base',
  standalone: true,
  imports: [],
  templateUrl: './filtros-base.component.html',
  styleUrl: './filtros-base.component.css',
})
export abstract class FiltrosBaseComponent implements OnInit {
  @Input() oidDepartamento?: number;
  @Input() modo: 'visualizar' | 'gestionar' = 'visualizar';

  protected calendarioHelper = inject(CalendarioHelperService);
  protected departamentoHelper = inject(DepartamentoHelperService);
  protected usuariosConActividadesHelper = inject(
    UsuariosConActividadesHelperService,
  );
  protected toastr = inject(ToastrService);

  // ========== DROPDOWNS COMPARTIDOS ==========
  calendariosDropdown: {
    value: number;
    label: string;
    estado: EstadoCalendario;
  }[] = [];
  departamentosDropdown: { value: number; label: string }[] = [];
  usuariosDropdown: { value: number | string; label: string }[] = [];

  // ========== LOADING STATES ==========
  loadingCalendarios = false;
  loadingDepartamentos = false;
  loadingUsuarios = false;

  // ========== CONTROL DE ROLES ==========
  filtroDepartamento: boolean = false;
  esDocente: boolean = false;
  oidUsuarioDocente: number | null = null;
  filtroResponsable: string = '';

  // ========== GETTER/SETTER ABSTRACTO para oidDepartamento del filtro hijo ==========
  protected abstract get oidDepartamentoFilter(): number | undefined;
  protected abstract set oidDepartamentoFilter(value: number | undefined);

  // ========== MÉTODOS ABSTRACTOS ==========
  protected abstract cargarFiltrosIniciales(): void;
  abstract aplicarFiltros(): void;
  abstract limpiarFiltros(): void;

  // ========== LIFECYCLE ==========
  ngOnInit(): void {
    this.filtroDepartamento = esRolEspecial();
    const { esDocente, oidUsuarioDocente } = obtenerRolDocente();
    this.esDocente = esDocente;
    this.oidUsuarioDocente = oidUsuarioDocente;
    this.oidDepartamentoFilter = this.oidDepartamento;
    this.cargarFiltrosIniciales();
  }

  // ========== MÉTODOS COMPARTIDOS ==========
  async loadCalendarios(): Promise<void> {
    try {
      this.loadingCalendarios = true;
      const todos = await this.calendarioHelper.getAllForDropdown();
      const filtrados = todos.filter((c) => c.estado !== 'DESHABILITADO');
      this.calendariosDropdown = ordenarCalendariosPorAnio(filtrados);
      // El hijo asigna oidCalendario a su propio filters
      this.onCalendarioCargado(
        seleccionarCalendarioAutomatico(this.calendariosDropdown),
      );
    } catch (error) {
      console.error('Error al cargar calendarios:', error);
      this.toastr.error('Error al cargar la lista de calendarios');
      this.calendariosDropdown = [];
    } finally {
      this.loadingCalendarios = false;
    }
  }

  // Hook para que cada hijo asigne el calendario a su propio filters
  protected abstract onCalendarioCargado(oidCalendario: number | string): void;

  async loadDepartamentos(): Promise<void> {
    try {
      this.loadingDepartamentos = true;
      const todos = await this.departamentoHelper.getAllForDropdown();
      this.departamentosDropdown = todos.map((d) => ({
        value: d.value,
        label: d.label,
      }));
      if (
        !this.oidDepartamentoFilter &&
        this.departamentosDropdown.length > 0
      ) {
        this.oidDepartamentoFilter = this.departamentosDropdown[0].value;
      }
    } catch (error) {
      console.error('Error al cargar departamentos:', error);
      this.toastr.error('Error al cargar la lista de departamentos');
      this.departamentosDropdown = [];
    } finally {
      this.loadingDepartamentos = false;
    }
  }

  async loadUsuarios(): Promise<void> {
    try {
      this.loadingUsuarios = true;
      const oidDepartamento = this.oidDepartamentoFilter;

      if (!oidDepartamento) {
        this.usuariosDropdown = [];
        return;
      }

      const filtros: UsuariosConActividadesFilters = {
        oidDepartamento,
        filtro: 'NO_DOCENCIA',
      };

      const usuarios = await this.usuariosConActividadesHelper.getAll(filtros);
      const mapeados = usuarios.map((ud) => ({
        value: ud.usuario.oidUsuario,
        label: `${ud.usuario.nombres} ${ud.usuario.apellidos}`.trim(),
      }));

      if (mapeados.length === 0) {
        this.toastr.info('No se encontraron usuarios para este departamento');
      }

      this.usuariosDropdown = [{ value: '', label: 'TODOS' }, ...mapeados];
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.toastr.error('Error al cargar la lista de usuarios responsables');
      this.usuariosDropdown = [];
    } finally {
      this.loadingUsuarios = false;
    }
  }

  onDepartamentoChange(): void {
    this.filtroResponsable = '';
    if (!this.esDocente && this.oidDepartamentoFilter) {
      this.loadUsuarios();
    } else {
      this.usuariosDropdown = [];
    }
  }

  recargarFiltros(): void {
    this.cargarFiltrosIniciales();
  }

  // ========== GETTERS DE GRID ==========
  private get conDepartamento(): boolean {
    return this.filtroDepartamento && this.modo === 'visualizar';
  }

  get clasesCalendario(): string {
    return getClasesCalendario(this.esDocente, this.conDepartamento);
  }
  get clasesDepartamento(): string {
    return getClasesDepartamento(this.esDocente);
  }
  get clasesContratacion(): string {
    return getClasesContratacion(this.esDocente, this.conDepartamento);
  }
  get clasesResponsable(): string {
    return getClasesResponsable(this.conDepartamento);
  }
  get clasesBotones(): string {
    return getClasesBotones(this.esDocente, this.conDepartamento);
  }
}
