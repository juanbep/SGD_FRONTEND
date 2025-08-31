import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarioAcademico } from '../../../../core/models/base/calendario-academico.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
declare const bootstrap: any;

interface Calendario {
  id: number;
  anio: string;
  numeroCalendario?: number;
  estado: string;
  periodo?: string;
  acuerdoAcademico?: string;
}

@Component({
  selector: 'app-academic-calendar-management',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './academic-calendar-management.component.html',
  styleUrl: './academic-calendar-management.component.css',
})
export class AcademicCalendarManagementComponent {
  calendarioVigente: any = null;
  historialCalendarios: any[] = [];
  calendariosEnEspera: any[] = [];

  isLoading: boolean = false;
  calendarioSeleccionadoId!: number;

  formCrearCalendario!: FormGroup;
  formEditarCalendario!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCalendarios();
    this.formCrearCalendario = this.fb.group({
      anioCalendario: [new Date().getFullYear(), Validators.required],
      numeroCalendario: [1, [Validators.required, Validators.min(1)]],
      observacion: [''],
    });
    this.formEditarCalendario = this.fb.group({
      anioCalendario: ['', Validators.required],
      numeroCalendario: ['', Validators.required],
      semanasClase: ['', Validators.required],
      semanasPreparacion: ['', Validators.required],
      horasTotales: ['', Validators.required],
      estado: ['', Validators.required],
      observacion: [''],
    });
  }

  crearCalendario(): void {
    if (this.formCrearCalendario.invalid) return;

    const payload = this.formCrearCalendario.value;

    this.http
      .post<any>('http://localhost:8090/sgd-back/api/calendarios', payload)
      .subscribe({
        next: (res) => {
          if (res?.codigo === 201) {
            this.toastr.success(res.mensaje || 'Calendario creado con éxito');

            // Mostrar datos del response en consola
            console.log('🟢 Calendario creado correctamente:', res.data);

            // Cerrar modal
            const modalEl = document.getElementById('crearCalendarioModal');
            if (modalEl) {
              const modal =
                bootstrap.Modal.getInstance(modalEl) ||
                new bootstrap.Modal(modalEl);
              modal.hide();
            }

            // const oid = res?.data?.oidcalendario;
            // if (oid) {
            //   this.router.navigate(['/app/calendarios/crear', oid]);
            // }
          } else {
            this.toastr.error('Error al crear calendario');
          }
        },
        error: () => {
          this.toastr.error('Error en el servidor');
        },
      });
  }

  getCalendarios(): void {
    this.isLoading = true;

    this.http
      .get<any>('http://localhost:8090/sgd-back/api/calendarios')
      .subscribe({
        next: (response) => {
          const calendarios = response?.data?.content || [];

          this.calendarioVigente = null;
          this.historialCalendarios = [];
          this.calendariosEnEspera = [];

          calendarios.forEach((cal: any) => {
            const calendario: any = {
              id: cal.oidcalendario,
              anioCalendario: cal.anioCalendario,
              numeroCalendario: cal.numeroCalendario,
              semanasClase: cal.semanasClase,
              semanasPreparacion: cal.semanasPreparacion,
              horasTotales: cal.horasTotales,
              estado: cal.estado,
              observacion: cal.observacion,
              acuerdoAcademico: cal.acuerdoAcademico || null,
              periodo: cal.numeroCalendario,
              fechaCreacion: cal.fechaCreacion,
              fechaActualizacion: cal.fechaActualizacion,
              usuarioCreacion: cal.usuarioCreacion,
              usuarioActualizacion: cal.usuarioActualizacion,
              fechas: cal.fechas,
            };

            switch (cal.estado) {
              case 'ACTIVO':
                this.calendarioVigente = calendario;
                break;
              case 'DESHABILITADO':
                this.historialCalendarios.push(calendario);
                break;
              case 'PENDIENTE':
              case 'APROBADO':
                this.calendariosEnEspera.push(calendario);
                break;
            }
          });

          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error al cargar calendarios:', err);
        },
      });
  }

  abrirModalCrearCalendario(): void {
    const modalEl = document.getElementById('crearCalendarioModal');
    if (!modalEl) return;

    const modal =
      bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.show();
  }

  abrirModalEditarCalendario(calendario: any): void {
    // Cargar valores en el formulario
    this.formEditarCalendario.patchValue({
      anioCalendario: calendario.anioCalendario,
      numeroCalendario: calendario.numeroCalendario,
      semanasClase: calendario.semanasClase,
      semanasPreparacion: calendario.semanasPreparacion,
      horasTotales: calendario.horasTotales,
      estado: calendario.estado,
      observacion: calendario.observacion,
    });

    // Guardar id temporalmente
    this.calendarioSeleccionadoId = calendario.id;

    // Abrir el modal
    const modalEl = document.getElementById('editarCalendarioModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  editarCalendario(): void {
    if (this.formEditarCalendario.invalid || !this.calendarioSeleccionadoId)
      return;

    const payload = this.formEditarCalendario.value;

    this.http
      .put<any>(
        `http://localhost:8090/sgd-back/api/calendarios/${this.calendarioSeleccionadoId}`,
        payload
      )
      .subscribe({
        next: (res) => {
          if (res?.codigo === 200) {
            this.toastr.success(
              res.mensaje || 'Calendario actualizado con éxito'
            );

            // Cerrar modal
            const modalEl = document.getElementById('editarCalendarioModal');
            if (modalEl) {
              const modal = bootstrap.Modal.getInstance(modalEl);
              modal?.hide();
            }

            this.getCalendarios(); // Actualiza la vista
          } else {
            this.toastr.error('Error al actualizar el calendario');
          }
        },
        error: () => {
          this.toastr.error('Error en el servidor');
        },
      });
  }
}
