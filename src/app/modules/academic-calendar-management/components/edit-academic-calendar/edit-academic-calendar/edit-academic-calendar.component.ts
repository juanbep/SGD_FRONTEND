import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe, NgIf, NgFor } from '@angular/common';
import { CatalogoNombresFecha } from '../../catalogos-nombres-fecha';
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
  catalogoFechas = CatalogoNombresFecha.NOMBRES_FECHA;

  formularioCalendario!: FormGroup;
  modoEdicion: boolean = false;
  backupCalendario: any;

  filaEnEdicionId: number | null = null;
  backupFecha: any = null;
  oidsUnicos = [1, 3, 4, 5, 7, 8, 9, 10];

  estadosDisponibles: string[] = [
    'ACTIVO',
    'APROBADO',
    'PENDIENTE',
    'DESHABILITADO',
  ];

  // Propiedades para el modal/formulario de nueva fecha
  mostrarFormularioNuevaFecha: boolean = false;
  nuevaFecha: any = {
    oidNombreFecha: null,
    fechaInicial: null,
    fechaFin: null,
    tipo: 'RESALTADAS',
  };

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

    const oidNombreFecha = fecha.oidNombreFecha ?? fecha.oidnombrefecha ?? null;
    //const oidsUnicos = [1, 3, 4, 5, 7, 8, 9, 10];
    const esFechaUnica = this.oidsUnicos.includes(Number(oidNombreFecha));

    const payload = {
      fechaInicial: esFechaUnica
        ? null
        : this.formatearFechaConHora(fecha.fechaInicial),
      fechaFin: this.formatearFechaConHora(fecha.fechaFin),
      oidCalendario: this.calendarioId,
      oidNombreFecha: oidNombreFecha,
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

  esFechaUnica(oidNombreFecha: number): boolean {
    return this.oidsUnicos.includes(Number(oidNombreFecha));
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

  eliminarFecha(oidFecha: number): void {
    if (!oidFecha) {
      this.toastr.warning('ID de fecha no válido.');
      return;
    }

    // Confirmación antes de eliminar
    if (confirm('¿Estás seguro de que deseas eliminar esta fecha?')) {
      const url = `http://localhost:8090/sgd-back/api/fechas/${oidFecha}`;

      this.http.delete<any>(url).subscribe({
        next: (response) => {
          if (response?.codigo === 200) {
            // Remover la fecha del array local
            this.calendario.fechas = this.calendario.fechas.filter(
              (fecha: any) => fecha.oidFecha !== oidFecha
            );

            this.toastr.success(
              response.mensaje || 'Fecha eliminada con éxito.'
            );
          } else {
            this.toastr.error('Error al eliminar la fecha.');
          }
        },
        error: (err) => {
          console.error('Error al eliminar fecha:', err);
          this.toastr.error(
            err?.error?.mensaje || 'Ocurrió un error al eliminar la fecha.'
          );
        },
      });
    }
  }

  // Métodos para agregar fecha
  abrirModalAgregarFecha(): void {
    this.mostrarFormularioNuevaFecha = true;
    this.resetearNuevaFecha();
  }

  resetearNuevaFecha(): void {
    this.nuevaFecha = {
      oidNombreFecha: null,
      fechaInicial: null,
      fechaFin: null,
      tipo: 'RESALTADAS',
    };
  }

  agregarFecha(): void {
    if (
      !this.calendarioId ||
      !this.nuevaFecha.oidNombreFecha ||
      !this.nuevaFecha.fechaFin
    ) {
      this.toastr.warning('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const esFechaUnica = this.oidsUnicos.includes(
      Number(this.nuevaFecha.oidNombreFecha)
    );

    const payload = {
      fechaInicial: esFechaUnica
        ? null
        : this.formatearFechaConHora(this.nuevaFecha.fechaInicial),
      fechaFin: this.formatearFechaConHora(this.nuevaFecha.fechaFin),
      oidCalendario: this.calendarioId,
      oidNombreFecha: this.nuevaFecha.oidNombreFecha,
      tipo: this.nuevaFecha.tipo || 'RESALTADAS',
    };

    const url = `http://localhost:8090/sgd-back/api/fechas`;
    console.log('Payload para agregar fecha:', payload);

    this.http.post<any>(url, payload).subscribe({
      next: (response) => {
        if (response?.codigo === 201 && response?.data) {
          // Buscar el nombre de la fecha agregada
          const nombreFecha = this.catalogoFechas.find(
            (f) => f.oidNombreFecha === response.data.oidNombreFecha
          );

          // Agregar el nombre a la respuesta del servidor
          const nuevaFechaConNombre = {
            ...response.data,
            nombre: nombreFecha?.nombre || 'Fecha sin nombre',
          };

          // Agregar la nueva fecha al array local
          if (!this.calendario.fechas) {
            this.calendario.fechas = [];
          }
          this.calendario.fechas.push(nuevaFechaConNombre);

          this.mostrarFormularioNuevaFecha = false;
          this.resetearNuevaFecha();

          this.toastr.success(response.mensaje || 'Fecha agregada con éxito.');
        } else {
          this.toastr.error('Error al agregar la fecha.');
        }
      },
      error: (err) => {
        console.error('Error al agregar fecha:', err);
        this.toastr.error(
          err?.error?.mensaje || 'Ocurrió un error al agregar la fecha.'
        );
      },
    });
  }

  convertirANumero(valor: any): number {
    return Number(valor);
  }

  cancelarAgregarFecha(): void {
    this.mostrarFormularioNuevaFecha = false;
    this.resetearNuevaFecha();
  }

  // Método helper para obtener el nombre de una fecha por su ID
  obtenerNombreFecha(oidNombreFecha: number): string {
    const fecha = this.catalogoFechas.find(
      (f) => f.oidNombreFecha === oidNombreFecha
    );
    return fecha?.nombre || 'Fecha sin nombre';
  }
}
