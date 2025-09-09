import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe, NgIf, NgFor } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-academic-calendar',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './edit-academic-calendar.component.html',
  styleUrl: './edit-academic-calendar.component.css',
})
export class EditAcademicCalendarComponent {
  calendario: any = null;
  calendarioId: number | null = null;

  formularioCalendario!: FormGroup;
  modoEdicion: boolean = false;
  backupCalendario: any;

  filaEnEdicionId: number | null = null;
  backupFecha: any = null;

  estadosDisponibles: string[] = [
    'ACTIVO',
    'APROBADO',
    'PENDIENTE',
    'DESHABILITADO',
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.calendarioId = +idParam;
        this.obtenerCalendarioPorId(this.calendarioId);
      }
    });
  }

  // === Obtener calendario por ID ===
  obtenerCalendarioPorId(id: number): void {
    const url = `http://localhost:8090/sgd-back/api/calendarios/${id}`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.codigo === 200 && response.data) {
          this.calendario = response.data;
        } else {
          //this.toastr.error('Calendario no encontrado o sin datos válidos.');
          alert('Calendario no encontrado o sin datos válidos.');
        }
      },
      error: () => {
        //this.toastr.error('Error al obtener el calendario.');
        alert('Error al obtener el calendario.');
      },
    });
  }

  // === Activar modo edición ===
  activarModoEdicion(): void {
    this.formularioCalendario = this.fb.group({
      semanasClase: [this.calendario.semanasClase, Validators.required],
      semanasPreparacion: [
        this.calendario.semanasPreparacion,
        Validators.required,
      ],
      horasTotales: [this.calendario.horasTotales, Validators.required],
      estado: [this.calendario.estado, Validators.required],
      observacion: [this.calendario.observacion || ''],
    });

    this.backupCalendario = structuredClone(this.calendario);
    this.modoEdicion = true;
  }

  // === Cancelar edición y restaurar backup ===
  cancelarEdicionCalendario(): void {
    this.calendario = structuredClone(this.backupCalendario);
    this.modoEdicion = false;
  }

  /**
   * @todo Implementar validaciones que eviten realizar la petición si no se ha modificado ningún dato.
   * En caso de cambios, enviar únicamente los campos actualizados junto con aquellos que sean obligatorios.
   * @returns
   */
  // === Guardar cambios ===
  guardarCambiosCalendario(): void {
    if (!this.calendario) {
      //this.toastr.error('No hay datos del calendario cargados.');
      alert('No hay datos del calendario cargados.');
      return;
    }

    if (
      !this.calendario.semanasClase ||
      !this.calendario.semanasPreparacion ||
      !this.calendario.horasTotales ||
      !this.calendario.estado
    ) {
      //this.toastr.warning('Por favor, completa todos los campos obligatorios.');
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const payload = {
      anioCalendario: this.calendario.anioCalendario,
      numeroCalendario: this.calendario.numeroCalendario,
      semanasClase: this.calendario.semanasClase,
      semanasPreparacion: this.calendario.semanasPreparacion,
      horasTotales: this.calendario.horasTotales,
      estado: this.calendario.estado,
      observacion: this.calendario.observacion || '',
    };

    this.http
      .put<any>(
        `http://localhost:8090/sgd-back/api/calendarios/${this.calendarioId}`,
        payload
      )
      .subscribe({
        next: (res) => {
          if (res?.codigo === 200) {
            this.toastr.success(
              res.mensaje || 'Calendario actualizado con éxito'
            );

            if (this.calendarioId) {
              this.obtenerCalendarioPorId(this.calendarioId);
            }

            this.modoEdicion = false;
          } else {
            this.toastr.error('Error al actualizar el calendario.');
          }
        },
        error: () => {
          this.toastr.error('Error en el servidor.');
        },
      });
  }

  //===============CRUD FECHAS=========================
  activarEdicionFecha(fecha: any): void {
    this.filaEnEdicionId = fecha.oidFecha;
    this.backupFecha = structuredClone(fecha);
  }

  cancelarEdicionFecha(fecha: any): void {
    Object.assign(fecha, this.backupFecha);
    this.filaEnEdicionId = null;
    this.backupFecha = null;
  }

  editarFecha(fecha: any): void {
    if (!fecha?.oidFecha || !this.calendarioId) return;

    const oidsUnicos = [1, 3, 4, 5, 7, 8, 9, 10];
    const esFechaUnica = oidsUnicos.includes(
      Number(fecha.oidNombreFecha ?? fecha.oidnombrefecha)
    );

    const payload = {
      fechaInicial: this.formatearFechaConHora(fecha.fechaInicial),
      fechaFin: esFechaUnica
        ? null
        : this.formatearFechaConHora(fecha.fechaFin),
      oidCalendario: this.calendarioId,
      oidNombreFecha: fecha.oidNombreFecha ?? fecha.oidnombrefecha ?? null,
      tipo: fecha.tipo ?? 'RESALTADAS',
    };

    const url = `http://localhost:8090/sgd-back/api/fechas/${fecha.oidFecha}`;
    console.log('Payload enviado:', payload);

    this.http.put<any>(url, payload).subscribe({
      next: (resp) => {
        if (resp?.codigo === 200 && resp?.data) {
          const actualizada = resp.data;
          fecha.fechaInicial = actualizada.fechaInicial;
          fecha.fechaFin = actualizada.fechaFin;
          fecha.tipo = actualizada.tipo;

          this.filaEnEdicionId = null;
          this.backupFecha = null;

          this.toastr.success(resp.mensaje || 'Fecha actualizada con éxito.');
        } else {
          this.toastr.error('Respuesta inesperada del servidor.');
          console.error('Respuesta inesperada:', resp);
        }
      },
      error: (err) => {
        console.error('Error al actualizar fecha', err);
        this.toastr.error(
          err?.error?.mensaje || 'Ocurrió un error al actualizar la fecha.'
        );
      },
    });
  }

  formatearFechaConHora(valor: any): string | null {
    if (!valor) return null;

    if (valor instanceof Date) {
      const y = valor.getFullYear();
      const m = String(valor.getMonth() + 1).padStart(2, '0');
      const d = String(valor.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}T00:00:00`;
    }

    if (typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
      return `${valor}T00:00:00`;
    }

    return valor;
  }

  eliminarFecha(fecha: any): void {}
}
