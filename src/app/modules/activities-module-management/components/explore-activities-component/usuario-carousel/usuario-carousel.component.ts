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

  private cargosHelper = inject(CargosActividadHelperService);

  usuarioEnConfirmacion: number | null = null;
  cargosMap: Map<number, CargoActividad> = new Map();
  cargandoCargos = false;

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

      // Recargar cargos si cambian las asignaciones
      if (changes['usuariosAsignaciones']) {
        await this.cargarCargos();
      }
    }
  }

  async cargarCargos(): Promise<void> {
    // Obtener IDs únicos de cargos
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
      // Cargar todos los cargos en paralelo
      const promesas = oidsCargos.map((oid) => this.cargosHelper.getById(oid));
      const cargos = await Promise.all(promesas);

      // Guardar en el Map
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
