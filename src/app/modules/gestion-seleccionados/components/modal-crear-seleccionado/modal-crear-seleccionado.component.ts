import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CreateSeleccionadoDTO } from '../../models';
import { UsuarioHelperService } from '../../../sgd-users-management/services';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

// Constantes para dropdowns
const TIPOS_DISPONIBLES = [
  { value: 'PLANTA', label: 'PLANTA' },
  { value: 'OCASIONAL', label: 'OCASIONAL' },
  { value: 'CATEDRA', label: 'CATEDRA' },
];

const DEDICACIONES_DISPONIBLES = [
  { value: 'TIEMPO COMPLETO', label: 'TIEMPO COMPLETO' },
  { value: 'MEDIO TIEMPO', label: 'MEDIO TIEMPO' },
  { value: 'TIEMPO PARCIAL', label: 'TIEMPO PARCIAL' },
];
@Component({
  selector: 'app-modal-crear-seleccionado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './modal-crear-seleccionado.component.html',
  styleUrl: './modal-crear-seleccionado.component.css',
})
export class ModalCrearSeleccionadoComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() oidCalendario!: number | string;
  @Input() creando: boolean = false;
  @Output() onConfirmar = new EventEmitter<CreateSeleccionadoDTO>();
  @Output() onCancelar = new EventEmitter<void>();

  // Servicios
  private fb = inject(FormBuilder);
  private usuarioHelper = inject(UsuarioHelperService);
  private toastr = inject(ToastrService);

  // Formulario
  seleccionadoForm!: FormGroup;

  // Estados
  loadingUsuarios = false;

  // Datos
  usuarios: { value: number; label: string; identificacion: string }[] = [];

  readonly tiposDisponibles = TIPOS_DISPONIBLES;
  readonly dedicacionesDisponibles = DEDICACIONES_DISPONIBLES;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarUsuarios();
  }

  inicializarFormulario(): void {
    this.seleccionadoForm = this.fb.group({
      oidUsuario: [null, [Validators.required]],
      tipo: [null],
      dedicacion: [null],
    });
  }

  cargarUsuarios(): void {
    this.loadingUsuarios = true;
    this.seleccionadoForm.get('oidUsuario')?.disable();

    // Cargar todos los usuarios con rol DOCENTE
    this.usuarioHelper
      .getAllForDropdown()
      .then((usuarios) => {
        this.usuarios = usuarios;
        this.loadingUsuarios = false;
        this.seleccionadoForm.get('oidUsuario')?.enable();
      })
      .catch((error) => {
        console.error('Error al cargar usuarios:', error);
        this.toastr.error('Error al cargar la lista de usuarios');
        this.usuarios = [];
        this.loadingUsuarios = false;
        this.seleccionadoForm.get('oidUsuario')?.enable();
      });
  }

  confirmar(): void {
    if (this.seleccionadoForm.invalid) {
      this.seleccionadoForm.markAllAsTouched();
      this.toastr.warning(
        'Por favor, completa todos los campos obligatorios',
        'Formulario Incompleto'
      );
      return;
    }

    const formValue = this.seleccionadoForm.value;

    const nuevoSeleccionado: CreateSeleccionadoDTO = {
      oidCalendario: Number(this.oidCalendario),
      oidUsuario: formValue.oidUsuario,
      tipo: formValue.tipo || null,
      dedicacion: formValue.dedicacion || null,
    };

    this.onConfirmar.emit(nuevoSeleccionado);
  }

  cancelar(): void {
    if (!this.creando) {
      this.seleccionadoForm.reset();
      this.onCancelar.emit();
    }
  }

  // Helpers de validación
  get oidUsuarioInvalid(): boolean {
    const control = this.seleccionadoForm.get('oidUsuario');
    return !!(control?.invalid && control?.touched);
  }
}
