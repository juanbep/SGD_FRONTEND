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

  formCrearCalendario!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  goToCreate() {
    this.router.navigate(['/gestion-calendario-academico/crear']);
  }

  ngOnInit(): void {
    this.formCrearCalendario = this.fb.group({
      anioCalendario: [new Date().getFullYear(), Validators.required],
      numeroCalendario: [1, [Validators.required, Validators.min(1)]],
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

            // Aquí pausamos antes de redirigir para que puedas ver el log
            // Quita el comentario cuando ya verifiques los datos:
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

  abrirModalCrearCalendario(): void {
    const modalEl = document.getElementById('crearCalendarioModal');
    if (!modalEl) return;

    const modal =
      bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.show();
  }
}
