import { Component, OnDestroy, OnInit } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-fab-ayuda',
  standalone: true,
  imports: [],
  templateUrl: './fab-ayuda.component.html',
  styleUrl: './fab-ayuda.component.scss',
})
export class FabAyudaComponent implements OnInit, OnDestroy {
  mostrarTooltip = false;
  private tooltipTimeout: any;
  private hideTooltipTimeout: any;

  ngOnInit() {
    // Mostrar tooltip automáticamente después de 10 segundos
    this.tooltipTimeout = setTimeout(() => {
      this.mostrarTooltip = true;

      // Ocultar después de 5 segundos
      this.hideTooltipTimeout = setTimeout(() => {
        this.mostrarTooltip = false;
      }, 10000);
    }, 5000);
  }

  ngOnDestroy() {
    // Limpiar timeouts al destruir el componente
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
    if (this.hideTooltipTimeout) {
      clearTimeout(this.hideTooltipTimeout);
    }
  }

  abrirModal() {
    // Ocultar tooltip si está visible
    this.mostrarTooltip = false;

    const modalElement = document.getElementById('modalInfoFlujo');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Mostrar tooltip al hacer hover (opcional)
  onMouseEnter() {
    if (!this.mostrarTooltip) {
      this.mostrarTooltip = true;
    }
  }

  onMouseLeave() {
    // Solo ocultar si no es la primera vez automática
    // Puedes ajustar esta lógica según prefieras
  }
}
