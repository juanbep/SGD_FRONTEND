import { Component } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-info-flujo',
  standalone: true,
  imports: [],
  templateUrl: './modal-info-flujo.component.html',
  styleUrl: './modal-info-flujo.component.scss',
})
export class ModalInfoFlujoComponent {
  constructor() {}

  cerrarModal() {
    const modalElement = document.getElementById('modalInfoFlujo');
    const modal = bootstrap.Modal.getInstance(modalElement!);
    modal?.hide();
  }
}
