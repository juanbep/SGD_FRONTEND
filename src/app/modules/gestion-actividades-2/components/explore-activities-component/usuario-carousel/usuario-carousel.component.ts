import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CargoActividad,
  UsuarioActividadAsignacion,
  UsuarioEnActividad,
} from '../../../models';
import { CargosActividadHelperService } from '../../../services';
import { RldService } from '../../../services/rld/rld.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuario-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-carousel.component.html',
  styleUrl: './usuario-carousel.component.css',
})
export class UsuarioCarouselComponent implements OnChanges, OnInit {
  @Input() usuariosAsignaciones: UsuarioActividadAsignacion[] = [];
  @Input() usuariosCompletos: UsuarioEnActividad[] = [];
  @Input() modo: 'visualizar' | 'gestionar' = 'visualizar';
  @Input() desasignando = false;
  @Output() onDesasignarUsuario = new EventEmitter<number>();
  @Input() oidCalendario: number | null = null;

  private cargosHelper = inject(CargosActividadHelperService);
  private rldService = inject(RldService);
  private toastr = inject(ToastrService);

  usuarioEnConfirmacion: number | null = null;
  cargosMap: Map<number, CargoActividad> = new Map();
  cargandoCargos = false;

  descargandoRLD: number | null = null;

  async ngOnInit(): Promise<void> {
    await this.cargarCargos();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['usuariosCompletos'] || changes['usuariosAsignaciones']) {
      if (
        this.usuarioEnConfirmacion &&
        !this.usuariosCompletos.find(
          (u) => u.oidUsuario === this.usuarioEnConfirmacion
        )
      ) {
        this.usuarioEnConfirmacion = null;
      }

      if (changes['usuariosAsignaciones']) {
        await this.cargarCargos();
      }
    }
  }

  async cargarCargos(): Promise<void> {
    const oidsCargos = [
      ...new Set(
        this.usuariosAsignaciones
          .map((ua) => ua.oidCargoActividad)
          .filter((oid) => oid !== null) as number[]
      ),
    ];

    if (oidsCargos.length === 0) return;

    this.cargandoCargos = true;

    try {
      const promesas = oidsCargos.map((oid) => this.cargosHelper.getById(oid));
      const cargos = await Promise.all(promesas);

      cargos.forEach((cargo) => {
        if (cargo) {
          this.cargosMap.set(cargo.oidCargoActividad, cargo);
        }
      });
    } catch (error) {
      console.error('Error cargando cargos:', error);
    } finally {
      this.cargandoCargos = false;
    }
  }

  async descargarRLD(usuario: UsuarioEnActividad): Promise<void> {
    if (!this.oidCalendario) {
      this.toastr.error(
        'No se puede descargar el RLD sin un calendario asignado'
      );
      return;
    }

    if (this.descargandoRLD) {
      return; // Ya hay una descarga en proceso
    }

    this.descargandoRLD = usuario.oidUsuario;

    try {
      await this.rldService.descargarRLD(
        usuario.oidUsuario,
        this.oidCalendario
      );
      this.toastr.success(
        `RLD de ${usuario.nombres} ${usuario.apellidos} descargado correctamente`
      );
    } catch (error: any) {
      console.error('Error al descargar RLD:', error);
      const mensaje =
        error?.error?.mensaje || 'Error al descargar el RLD del docente';
      this.toastr.error(mensaje);
    } finally {
      this.descargandoRLD = null;
    }
  }

  getHorasUsuario(oidUsuario: number): number {
    const asignacion = this.usuariosAsignaciones.find(
      (ua) => ua.oidUsuario === oidUsuario
    );
    return asignacion?.horas || 0;
  }

  getOidCargoUsuario(oidUsuario: number): number | null {
    const asignacion = this.usuariosAsignaciones.find(
      (ua) => ua.oidUsuario === oidUsuario
    );
    return asignacion?.oidCargoActividad || null;
  }

  getNombreCargoUsuario(oidUsuario: number): string {
    const oidCargo = this.getOidCargoUsuario(oidUsuario);
    if (!oidCargo) return 'Sin cargo';

    const cargo = this.cargosMap.get(oidCargo);
    return cargo?.nombre || `Cargo #${oidCargo}`;
  }

  mostrarConfirmacion(oidUsuario: number): void {
    this.usuarioEnConfirmacion = oidUsuario;

    // Scroll suave al card de confirmación
    setTimeout(() => {
      this.scrollToConfirmacion(oidUsuario);
    }, 150);
  }

  private scrollToConfirmacion(oidUsuario: number): void {
    const elemento = document.querySelector(
      `[data-usuario-id="${oidUsuario}"]`
    );

    if (elemento) {
      elemento.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }

  cancelarConfirmacion(): void {
    this.usuarioEnConfirmacion = null;
  }

  confirmarDesasignacion(oidUsuario: number): void {
    this.onDesasignarUsuario.emit(oidUsuario);
    this.usuarioEnConfirmacion = null;
  }

  get totalUsuarios(): number {
    return this.usuariosCompletos.length;
  }
}
