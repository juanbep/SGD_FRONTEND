import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioCarouselComponent } from '../../usuario-carrousel/usuario-carousel/usuario-carousel.component';

@Component({
  selector: 'app-modal-usuarios',
  standalone: true,
  imports: [CommonModule, UsuarioCarouselComponent],
  templateUrl: './modal-usuarios.component.html',
  styleUrl: './modal-usuarios.component.css',
})
export class ModalUsuariosComponent {
  @Input() usuariosIds: number[] = [];
  @Input() visible: boolean = false;
  @Output() onCerrar = new EventEmitter<void>();

  cerrar(): void {
    this.onCerrar.emit();
  }
}
