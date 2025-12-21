import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Materia } from '../../../models';
import { MateriaService } from '../../../services/materia/materia.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eliminar-materia-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eliminar-materia-modal.component.html',
  styleUrl: './eliminar-materia-modal.component.css',
})
export class EliminarMateriaModalComponent {
  @Input() materia!: Materia;
  @Output() onMateriaEliminada = new EventEmitter<void>();
  @Output() onCancelar = new EventEmitter<void>();

  private materiaService = inject(MateriaService);
  private toastr = inject(ToastrService);

  eliminando = false;

  confirmarEliminacion(): void {
    this.eliminando = true;

    this.materiaService
      .deleteMateria({ idMateria: this.materia.idMateria })
      .subscribe({
        next: (response) => {
          if (response.codigo >= 200 && response.codigo < 300) {
            this.toastr.success(
              response.mensaje || 'Materia eliminada correctamente',
              'Eliminación exitosa'
            );
            this.onMateriaEliminada.emit();
          } else {
            this.toastr.warning(
              response.mensaje || 'No se pudo eliminar la materia',
              'Advertencia'
            );
            this.eliminando = false;
          }
        },
        error: (error) => {
          console.error('Error al eliminar materia:', error);
          const mensajeError =
            error?.error?.mensaje ||
            error?.message ||
            'Error al eliminar la materia. Intente nuevamente.';
          this.toastr.error(mensajeError, 'Error al eliminar');
          this.eliminando = false;
        },
      });
  }

  cancelar(): void {
    this.onCancelar.emit();
  }
}
