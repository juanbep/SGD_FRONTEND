import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NecesidadResponse, UpdateNecesidadDTO } from '../../models';

@Component({
  selector: 'app-modal-editar-necesidad',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './modal-editar-necesidad.component.html',
  styleUrl: './modal-editar-necesidad.component.css',
})
export class ModalEditarNecesidadComponent implements OnInit {
  @Input() necesidad: NecesidadResponse | null = null;
  @Input() visible: boolean = false;
  @Input() editando: boolean = false;
  @Output() onCerrar = new EventEmitter<void>();
  @Output() onGuardar = new EventEmitter<UpdateNecesidadDTO>();

  // Formulario
  formData: {
    grupo: string;
    cupo: number | null;
  } = {
    grupo: '',
    cupo: null,
  };

  // Opciones de grupos
  gruposDisponibles = [
    { value: 'A', label: 'Grupo A' },
    { value: 'B', label: 'Grupo B' },
    { value: 'C', label: 'Grupo C' },
    { value: 'D', label: 'Grupo D' },
    { value: 'E', label: 'Grupo E' },
  ];

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnChanges(): void {
    if (this.visible && this.necesidad) {
      this.cargarDatos();
    }
  }

  cargarDatos(): void {
    if (this.necesidad) {
      this.formData = {
        grupo: this.necesidad.grupo,
        cupo: this.necesidad.cupo,
      };
    }
  }

  cerrar(): void {
    if (!this.editando) {
      this.onCerrar.emit();
    }
  }

  guardar(): void {
    if (!this.necesidad || !this.validarFormulario()) {
      return;
    }

    const dto: UpdateNecesidadDTO = {
      oidNecesidad: this.necesidad.oidNecesidad,
      grupo: this.formData.grupo,
      cupo: this.formData.cupo!,
    };

    this.onGuardar.emit(dto);
  }

  validarFormulario(): boolean {
    if (!this.formData.grupo || this.formData.grupo === '') {
      return false;
    }

    if (!this.formData.cupo || this.formData.cupo <= 0) {
      return false;
    }

    return true;
  }

  getBadgeClassEstado(estado: string | undefined): string {
    switch (estado) {
      case 'BORRADOR':
        return 'bg-secondary';
      case 'PUBLICADA':
        return 'bg-success';
      case 'CANCELADA':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
