import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe, NgIf, NgFor } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

declare const bootstrap: any;

@Component({
  selector: 'app-view-academic-calendar',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './view-academic-calendar.component.html',
  styleUrl: './view-academic-calendar.component.css',
})
export class ViewAcademicCalendarComponent implements OnInit {
  calendario: any = null;
  calendarioId: number | null = null;

  formEditarFecha!: FormGroup;
  fechaSeleccionada: any | null = null;

  // instancia del modal (bootstrap 5)
  private modalEditarFechaInstancia: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.calendarioId = +idParam;
        this.obtenerCalendarioPorId(this.calendarioId);
      }
    });

    this.formEditarFecha = this.fb.group(
      {
        fechaInicial: [''],
        fechaFin: [''],
      },
      { validators: this.alMenosUnaFechaValidator() } 
    );

    const modalEl = document.getElementById('modalEditarFecha');
    if (modalEl) {
      this.modalEditarFechaInstancia =
        bootstrap.Modal.getOrCreateInstance(modalEl);
    }
  }

  obtenerCalendarioPorId(id: number): void {
    const url = `http://localhost:8090/sgd-back/api/calendarios/${id}`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.codigo === 200 && response.data) {
          this.calendario = response.data;
        } else {
          console.error('Calendario no encontrado o sin datos válidos');
        }
      },
      error: (error) => {
        console.error('Error al obtener el calendario:', error);
      },
    });
  }

  abrirModalEditarFecha(fecha: any): void {
    this.fechaSeleccionada = fecha;

    this.formEditarFecha.reset({
      fechaInicial: this.aFechaInput(fecha?.fechaInicial || null),
      fechaFin: this.aFechaInput(fecha?.fechaFin || null),
    });

    this.formEditarFecha.markAsPristine();
    this.formEditarFecha.markAsUntouched();

    if (this.modalEditarFechaInstancia) {
      this.modalEditarFechaInstancia.show();
    }
  }

  editarFecha(): void {
    if (!this.fechaSeleccionada?.oidFecha) return;
    if (!this.calendarioId) return;
    if (this.formEditarFecha.invalid) {
      this.formEditarFecha.markAllAsTouched();
      return;
    }

    const valores = this.formEditarFecha.value as {
      fechaInicial: string;
      fechaFin: string;
    };

    const payload = {
      fechaInicial: valores.fechaInicial
        ? this.aIsoConHora(valores.fechaInicial, '00:00:00')
        : null,
      fechaFin: valores.fechaFin
        ? this.aIsoConHora(valores.fechaFin, '00:00:00')
        : null,
      oidCalendario: this.calendarioId,
      oidNombreFecha:
        this.fechaSeleccionada.oidNombreFecha ??
        this.fechaSeleccionada.oidnombrefecha ??
        null,
      tipo: this.fechaSeleccionada.tipo ?? 'RESALTADAS', //valor por defecto se establece en tipo 'RESALTADAS', validar después 
    };

    const url = `http://localhost:8090/sgd-back/api/fechas/${this.fechaSeleccionada.oidFecha}`;

    this.http.put<any>(url, payload).subscribe({
      next: (resp) => {
        if (resp?.codigo === 200 && resp?.data) {
          const actualizada = resp.data;
          this.fechaSeleccionada.fechaInicial = actualizada.fechaInicial;
          this.fechaSeleccionada.fechaFin = actualizada.fechaFin;
          this.fechaSeleccionada.tipo = actualizada.tipo;

          if (this.modalEditarFechaInstancia) {
            this.modalEditarFechaInstancia.hide();
          }
        } else {
          console.error('Respuesta inesperada al actualizar fecha', resp);
        }
      },
      error: (err) => {
        console.error('Error al actualizar fecha', err);
        alert(err?.error?.mensaje || 'Ocurrió un error al actualizar la fecha.');
      },
    });
  }

  // ====== Utilidades internas ======

  private alMenosUnaFechaValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const inicio = control.get('fechaInicial')?.value;
      const fin = control.get('fechaFin')?.value;
      return inicio || fin ? null : { alMenosUnaFecha: true };
    };
  }

  private aFechaInput(valor: string | Date | null): string | null {
    if (!valor) return null;
    const d = typeof valor === 'string' ? new Date(valor) : valor;
    if (isNaN(d.getTime())) return null;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; // formato que espera <input type="date">
  }

  private aIsoConHora(fechaYYYYMMDD: string, hhmmss: string): string {
    return `${fechaYYYYMMDD}T${hhmmss}`; // 'YYYY-MM-DDTHH:mm:ss'
  }
}
