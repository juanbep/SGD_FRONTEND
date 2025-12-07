import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioCarouselComponent } from '../usuario-carousel/usuario-carousel.component';
import {
  FormularioAsignarUsuarioComponent,
  NuevoUsuarioDTO,
} from '../formulario-asignar-usuario/formulario-asignar-usuario.component';
import { ActividadHelperService } from '../../../services';
import { ToastrService } from 'ngx-toastr';
import {
  UsuarioActividadAsignacion,
  UsuarioEnActividad,
  ActividadResponse,
} from '../../../models';

@Component({
  selector: 'app-modal-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    UsuarioCarouselComponent,
    FormularioAsignarUsuarioComponent, // ← AGREGAR
  ],
  templateUrl: './modal-usuarios.component.html',
  styleUrl: './modal-usuarios.component.css',
})
export class ModalUsuariosComponent {
  @Input() usuariosAsignaciones: UsuarioActividadAsignacion[] = [];
  @Input() usuariosCompletos: UsuarioEnActividad[] = [];
  @Input() visible: boolean = false;
  @Input() oidActividad: number | null = null;
  @Input() oidCalendario: number | null = null;
  @Input() modo: 'visualizar' | 'gestionar' = 'visualizar';

  @Output() onCerrar = new EventEmitter<void>();
  @Output() onUsuarioDesasignado = new EventEmitter<void>();
  @Output() onUsuarioAsignado = new EventEmitter<void>();

  // ViewChild para acceder al formulario hijo
  @ViewChild(FormularioAsignarUsuarioComponent)
  formularioAsignar?: FormularioAsignarUsuarioComponent;

  private actividadHelper = inject(ActividadHelperService);
  private toastr = inject(ToastrService);

  desasignando: boolean = false;
  mostrandoFormularioAsignacion: boolean = false;
  asignando: boolean = false;

  // Actividad
  private actividad: ActividadResponse | null = null;
  oidTipoActividadActual: number = 0;

  private async cargarActividad(): Promise<void> {
    if (!this.oidActividad) {
      this.toastr.error('No se puede cargar la actividad');
      return;
    }

    try {
      this.actividad = await this.actividadHelper.getById(this.oidActividad);

      if (!this.actividad) {
        throw new Error('No se pudo obtener la actividad');
      }
    } catch (error) {
      console.error('Error al cargar actividad:', error);
      this.toastr.error('Error al cargar los datos de la actividad');
    }
  }

  async desasignarUsuario(oidUsuario: number): Promise<void> {
    if (!this.oidActividad || !this.oidCalendario) {
      console.error('Faltan oidActividad u oidCalendario para desasignar');
      this.toastr.error('Error: Faltan datos necesarios para desasignar');
      return;
    }

    if (this.desasignando) {
      return;
    }

    this.desasignando = true;

    try {
      const resultado = await this.actividadHelper.desasignarUsuario(
        this.oidActividad,
        this.oidCalendario,
        oidUsuario
      );

      if (resultado) {
        const mensaje =
          resultado.mensaje || 'Usuario desasignado correctamente';
        this.toastr.success(mensaje);

        this.usuariosAsignaciones = this.usuariosAsignaciones.filter(
          (ua) => ua.oidUsuario !== oidUsuario
        );
        this.usuariosCompletos = this.usuariosCompletos.filter(
          (u) => u.oidUsuario !== oidUsuario
        );

        this.onUsuarioDesasignado.emit();
      }

      this.desasignando = false;
    } catch (error: any) {
      console.error('Error al desasignar usuario:', error);
      const mensaje =
        error?.error?.mensaje ||
        'Error al desasignar el usuario de la actividad';
      this.toastr.error(mensaje);
      this.desasignando = false;
    }
  }

  async asignarUsuario(nuevoUsuario: NuevoUsuarioDTO): Promise<void> {
    if (!this.oidActividad || !this.oidCalendario || !this.actividad) {
      this.toastr.error('Error: Faltan datos necesarios para asignar');
      return;
    }

    this.asignando = true;

    try {
      // Construir el array de usuarios actualizado
      const usuariosActualizados = [...this.usuariosAsignaciones, nuevoUsuario];

      // Construir atributos desde la actividad completa
      const atributos = this.actividad.actividad.atributos.map((attr) => ({
        nombre: attr.codigoAtributo,
        tipo: 'VARCHAR',
        valor: attr.valor,
      }));

      // Construir el DTO COMPLETO de actualización
      const updateDTO = {
        oidActividad: this.oidActividad,
        oidTipoActividad:
          this.actividad.actividad.tipoActividad.oidTipoActividad,
        oidEstadoActividad: this.actividad.actividad.oidEstadoActividad,
        nombreActividad: this.actividad.actividad.nombreActividad,
        semanas: this.actividad.actividad.semanas,
        oidCalendario: this.oidCalendario,
        usuarios: usuariosActualizados,
        atributos: atributos,
      };

      // Llamar al servicio de actualización
      const resultado = await this.actividadHelper.update(updateDTO);

      if (resultado) {
        this.toastr.success('Usuario asignado correctamente');

        // Recargar actividad completa para obtener datos actualizados
        await this.cargarActividad();

        if (this.actividad) {
          this.usuariosAsignaciones = this.actividad.usuariosActividad;
          this.usuariosCompletos = this.actividad.usuarios;
        }

        this.onUsuarioAsignado.emit();
        this.cerrarFormularioAsignacion();
      }

      this.asignando = false;
    } catch (error: any) {
      console.error('Error al asignar usuario:', error);
      const mensaje =
        error?.error?.mensaje || 'Error al asignar el usuario a la actividad';
      this.toastr.error(mensaje);
      this.asignando = false;
    }
  }

  async abrirFormularioAsignacion(): Promise<void> {
    // Cargar actividad completa para obtener el tipo de actividad
    await this.cargarActividad();

    if (this.actividad) {
      this.oidTipoActividadActual =
        this.actividad.actividad.tipoActividad.oidTipoActividad;
      this.mostrandoFormularioAsignacion = true;
    } else {
      this.toastr.error('No se pudo cargar la información de la actividad');
    }
  }

  cerrarFormularioAsignacion(): void {
    this.mostrandoFormularioAsignacion = false;
  }

  cerrarModal(): void {
    this.mostrandoFormularioAsignacion = false;
    this.onCerrar.emit();
  }
}
