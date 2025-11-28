import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioHelperService } from '../../../../sgd-users-management/services';
import { Usuario } from '../../../../sgd-users-management/models';

@Component({
  selector: 'app-usuario-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-carousel.component.html',
  styleUrl: './usuario-carousel.component.css',
})
export class UsuarioCarouselComponent implements OnInit {
  @Input() usuariosIds: number[] = []; // IDs de los usuarios asociados
  @Input() modo: 'visualizar' | 'gestionar' = 'visualizar';
  @Output() onDesasignarUsuario = new EventEmitter<number>();
  private usuarioHelper = inject(UsuarioHelperService);

  usuarios: Usuario[] = [];
  currentIndex: number = 0;
  usuarioActual: Usuario | null = null;
  usuarioEnConfirmacion: number | null = null;
  loading: boolean = false;
  error: string = '';

  async ngOnInit(): Promise<void> {
    if (this.usuariosIds && this.usuariosIds.length > 0) {
      await this.cargarTodosLosUsuarios();
    }
  }

  async cargarTodosLosUsuarios(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      // Cargar todos los usuarios en paralelo
      const promesas = this.usuariosIds.map((id) =>
        this.usuarioHelper.getById(id)
      );
      const resultados = await Promise.all(promesas);

      // Filtrar usuarios válidos
      this.usuarios = resultados.filter(
        (usuario) => usuario !== null
      ) as Usuario[];

      if (this.usuarios.length === 0) {
        this.error = 'No se pudieron cargar los usuarios';
      }
    } catch (err) {
      this.error = 'Error al cargar los usuarios';
      console.error('Error cargando usuarios:', err);
    } finally {
      this.loading = false;
    }
  }

  // Método para mostrar confirmación
  mostrarConfirmacion(oidUsuario: number): void {
    this.usuarioEnConfirmacion = oidUsuario;
  }

  // Método para cancelar confirmación
  cancelarConfirmacion(): void {
    this.usuarioEnConfirmacion = null;
  }

  // Método para confirmar desasignación
  confirmarDesasignacion(oidUsuario: number): void {
    this.onDesasignarUsuario.emit(oidUsuario);
    this.usuarioEnConfirmacion = null;
  }


  get totalUsuarios(): number {
    return this.usuarios.length;
  }
}
