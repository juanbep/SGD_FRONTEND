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
  Validators,
} from '@angular/forms';

declare const bootstrap: any;

@Component({
  selector: 'app-edit-academic-calendar',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './edit-academic-calendar.component.html',
  styleUrl: './edit-academic-calendar.component.css',
})
export class EditAcademicCalendarComponent {
  calendario: any = null;
  calendarioId: number | null = null;

  //===EDITAR===
  formEditarFecha!: FormGroup;
  fechaSeleccionada: any | null = null;
  private modalEditarFechaInstancia: any;

  // ====== CREAR ======
  formCrearFecha!: FormGroup;
  private modalCrearFechaInstancia: any;

  // Tipos de fecha -> mover a otra clase despues
  tiposFecha = [
    'RESALTADAS',
    'NO_RESALTADAS',
    'ADMINISTRATIVAS',
    'CLASES',
    'OCASIONAL',
    'CATEDRA',
    'PLANTA',
    'BECARIO_Y_PRACTICANTE',
  ];

  // Catálogo de nombres de fecha (id + nombre). Mover a otra clase despues
  nombresFecha = [
    { oidNombreFecha: 1, nombre: 'Inicio del periodo' },
    {
      oidNombreFecha: 2,
      nombre: 'Matrículas académicas estudiantes regulares',
    },
    { oidNombreFecha: 3, nombre: 'Inicio de clases' },
    {
      oidNombreFecha: 4,
      nombre:
        'Plazo máximo para presentar solicitudes de cancelación de asignaturas y/o matrícula del {calendar}, debidamente justificadas',
    },
    { oidNombreFecha: 5, nombre: 'Registro de Notas 70% en SIMCA' },
    { oidNombreFecha: 6, nombre: 'Evaluación docente {calendar}' },
    { oidNombreFecha: 7, nombre: 'Finalización de clases' },
    {
      oidNombreFecha: 8,
      nombre:
        'Plazo máximo para finales, supletorios y habilitaciones a cargo de profesores de cátedra',
    },
    {
      oidNombreFecha: 9,
      nombre: 'Cierre de SIMCA para registro de calificaciones',
    },
    {
      oidNombreFecha: 10,
      nombre: 'Finalización de periodo académico {calendar}',
    },
    {
      oidNombreFecha: 11,
      nombre:
        'Inducción a estudiantes de primer semestre, periodo académico {calendar}',
    },
    { oidNombreFecha: 12, nombre: 'Ajustes de matrícula SIMCA' },
    {
      oidNombreFecha: 13,
      nombre: 'Adiciones matrícula a través del módulo SIMCA (KIRA)',
    },
    { oidNombreFecha: 14, nombre: 'Listas definitivas de clase' },
    { oidNombreFecha: 15, nombre: 'PRIMEROS PARCIALES' },
    {
      oidNombreFecha: 16,
      nombre: 'Plazo para registro de notas primeros parciales',
    },
    { oidNombreFecha: 17, nombre: 'SEGUNDOS PARCIALES' },
    {
      oidNombreFecha: 18,
      nombre:
        'Plazo máximo para recepción de solicitudes de reingreso {calendar}',
    },
    {
      oidNombreFecha: 19,
      nombre:
        'Exámenes finales, supletorios, habilitaciones y validaciones - profesores de planta y ocasionales',
    },
    { oidNombreFecha: 20, nombre: 'Planeación de cursos especiales' },
    { oidNombreFecha: 21, nombre: 'Desarrollo de cursos especiales' },
    {
      oidNombreFecha: 22,
      nombre:
        'Solicitud de presentación de nuevas electivas al consejo de facultad',
    },
    {
      oidNombreFecha: 23,
      nombre: 'Reporte de las electivas a ofrecer por el departamento',
    },
    {
      oidNombreFecha: 24,
      nombre: 'Presentación de electivas y líneas de énfasis',
    },
    {
      oidNombreFecha: 25,
      nombre: 'Pre-inscripción de electivas y líneas de énfasis',
    },
    { oidNombreFecha: 26, nombre: 'SEMANAS DE CLASE' },
    { oidNombreFecha: 27, nombre: 'SEMANAS DE OCASIONALES' },
    { oidNombreFecha: 28, nombre: 'SEMANAS DE CATEDRA' },
    { oidNombreFecha: 29, nombre: 'SEMANAS DE PLANTA' },
    { oidNombreFecha: 30, nombre: 'SEMANAS DE BECARIO Y PRACTICANTE' },
  ];

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

    // ====== EDITAR ======

    this.formEditarFecha = this.fb.group(
      {
        fechaInicial: [''],
        fechaFin: [''],
      },
      { validators: this.alMenosUnaFechaValidator() }
    );

    // ====== CREAR ======
    this.formCrearFecha = this.fb.group(
      {
        oidNombreFecha: [null, Validators.required],
        fechaInicial: [''],
        fechaFin: [''],
        tipo: ['RESALTADAS', Validators.required],
      },
      { validators: this.alMenosUnaFechaValidator() }
    );

    // Instancias de modales Bootstrap
    const modalEl = document.getElementById('modalEditarFecha');
    if (modalEl) {
      this.modalEditarFechaInstancia =
        bootstrap.Modal.getOrCreateInstance(modalEl);
    }

    const modalCrearEl = document.getElementById('modalCrearFecha');
    if (modalCrearEl)
      this.modalCrearFechaInstancia =
        bootstrap.Modal.getOrCreateInstance(modalCrearEl);
  }

  // ====== Cargar calendario ======
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

  // ====== EDITAR ======
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
        alert(
          err?.error?.mensaje || 'Ocurrió un error al actualizar la fecha.'
        );
      },
    });
  }

  // ====== CREAR ======

  abrirModalCrearFecha(): void {
    this.formCrearFecha.reset({
      oidNombreFecha: null,
      fechaInicial: '',
      fechaFin: '',
      tipo: 'RESALTADAS',
    });
    this.formCrearFecha.markAsPristine();
    this.formCrearFecha.markAsUntouched();
    this.modalCrearFechaInstancia?.show();
  }

  crearFecha(): void {
    if (!this.calendarioId) return;
    if (this.formCrearFecha.invalid) {
      this.formCrearFecha.markAllAsTouched();
      return;
    }

    const v = this.formCrearFecha.value as {
      oidNombreFecha: number | null;
      fechaInicial: string;
      fechaFin: string;
      tipo: string;
    };

    const payload = {
      fechaInicial: v.fechaInicial
        ? this.aIsoConHora(v.fechaInicial, '00:00:00')
        : null,
      fechaFin: v.fechaFin ? this.aIsoConHora(v.fechaFin, '00:00:00') : null,
      tipo: v.tipo,
      oidNombreFecha: v.oidNombreFecha,
      oidCalendario: this.calendarioId,
    };

    const urlCrear = 'http://localhost:8090/sgd-back/api/fechas';

    this.http.post<any>(urlCrear, payload).subscribe({
      next: (resp) => {
        if (resp?.codigo === 200 && resp?.data) {
          const nueva = resp.data;
          // Resolver nombre por catálogo (o usar el que devuelva el backend)
          const nombre =
            this.nombresFecha.find(
              (x) => x.oidNombreFecha === nueva.oidNombreFecha
            )?.nombre ||
            nueva.nombre ||
            '—';

          const fila = {
            oidFecha: nueva.oidFecha,
            oidNombreFecha: nueva.oidNombreFecha,
            nombre,
            fechaInicial: nueva.fechaInicial,
            fechaFin: nueva.fechaFin,
            tipo: nueva.tipo,
            oidCalendario: nueva.oidCalendario,
          };

          this.calendario.fechas = this.calendario.fechas || [];
          this.calendario.fechas.unshift(fila);

          this.modalCrearFechaInstancia?.hide();
          alert(resp.mensaje || 'Fecha guardada correctamente.');
        } else {
          console.error('Respuesta inesperada al crear fecha', resp);
          alert('No se pudo crear la fecha.');
        }
      },
      error: (err) => {
        console.error('Error al crear fecha', err);
        alert(err?.error?.mensaje || 'Ocurrió un error al crear la fecha.');
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
