import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NecesidadDescargaHelperService } from '../../services/necesidades/necesidad-descarga-helper.service';
import {
  getUserRoles,
  isUserDataAvailable,
} from '../../../auth/utils/user-storage.utils';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-modal-descarga-necesidades',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './modal-descarga-necesidades.component.html',
  styleUrl: './modal-descarga-necesidades.component.css',
})
export class ModalDescargaNecesidadesComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() calendarios: any[] = []; // Array de calendarios disponibles
  @Input() oidDepartamento: number | null = null; // Viene del usuario logueado
  @Input() departamentos: any[] = []; // Array de departamentos disponibles

  @Output() onCerrar = new EventEmitter<void>();

  private necesidadDescargaHelper = inject(NecesidadDescargaHelperService);
  private toastr = inject(ToastrService);

  oidCalendarioSeleccionado: number | null = null;
  oidDepartamentoSeleccionado: number | null = null;
  descargarTodos: boolean = false; // Para roles especiales
  descargando: boolean = false;
  rolEspecial: boolean = false;

  ngOnInit(): void {
    this.verificarRolesEspeciales();

    // Si NO es rol especial, usar el departamento del usuario
    if (!this.rolEspecial) {
      this.oidDepartamentoSeleccionado = this.oidDepartamento;
    }
  }

  private verificarRolesEspeciales(): void {
    if (!isUserDataAvailable()) {
      this.rolEspecial = false;
      return;
    }

    const roles = getUserRoles();
    const rolesEspeciales = [
      'SECRETARIA/O FACULTAD',
      'SECRETARIO',
      'SECRETARIA',
      'DECANO',
    ];

    this.rolEspecial = roles.some((rol) => rolesEspeciales.includes(rol));
  }

  onDescargarTodosChange(): void {
    // Si marca "Todos los departamentos", limpiar la selección de departamento
    if (this.descargarTodos) {
      this.oidDepartamentoSeleccionado = null;
    }
  }

  async descargarNecesidades(): Promise<void> {
    // Validaciones
    if (!this.oidCalendarioSeleccionado) {
      this.toastr.warning('Debe seleccionar un calendario');
      return;
    }

    // Si es rol especial y NO marcó "Todos", debe seleccionar departamento
    if (
      this.rolEspecial &&
      !this.descargarTodos &&
      !this.oidDepartamentoSeleccionado
    ) {
      this.toastr.warning(
        'Debe seleccionar un departamento o marcar "Todos los departamentos"',
      );
      return;
    }

    // Si NO es rol especial, debe tener departamento
    if (!this.rolEspecial && !this.oidDepartamentoSeleccionado) {
      this.toastr.error('No se pudo obtener el departamento del usuario');
      return;
    }

    this.descargando = true;

    try {
      const filters = {
        oidCalendario: this.oidCalendarioSeleccionado,
        oidDepartamento: this.descargarTodos
          ? undefined
          : this.oidDepartamentoSeleccionado!,
      };

      const resultado =
        await this.necesidadDescargaHelper.descargarYGuardar(filters);

      if (resultado) {
        this.toastr.success('Necesidades descargadas correctamente');
        this.cerrar();
      } else {
        this.toastr.error('Error al descargar las necesidades');
      }
    } catch (error: any) {
      console.error('Error al descargar necesidades:', error);
      const mensaje =
        error?.error?.mensaje || 'Error al descargar las necesidades';
      this.toastr.error(mensaje);
    } finally {
      this.descargando = false;
    }
  }

  cerrar(): void {
    this.onCerrar.emit();
  }
}
