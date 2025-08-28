import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { CalendarioAcademico } from '../../../../../core/models/base/calendario-academico.model';
import {
  FECHAS_RESALTADAS,
  FECHAS_NO_RESALTADAS,
} from '../../../../../core/enums/fechas-resaltadas';

@Component({
  selector: 'app-create-academic-calendar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-academic-calendar.component.html',
  styleUrl: './create-academic-calendar.component.css',
})
export class CreateAcademicCalendarComponent {
  calendarForm!: FormGroup;
  FECHAS_RESALTADAS = FECHAS_RESALTADAS;
  FECHAS_NO_RESALTADAS = FECHAS_NO_RESALTADAS;

  // Modal state
  modalOpen = false;
  modalForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.calendarForm = this.fb.group({
      acuerdoAcademico: ['', Validators.required],
      anio: [new Date().getFullYear(), Validators.required],
      periodo: ['', Validators.required],
      estado: ['PENDIENTE', Validators.required],

      eventosResaltados: this.fb.array(
        this.FECHAS_RESALTADAS.map(() =>
          this.fb.group({
            fechaInicio: ['', Validators.required],
            fechaFin: [''],
          })
        )
      ),

      eventosNoResaltados: this.fb.array([]),
    });

    // DEBUG
    console.log(
      'resaltadas mock:',
      this.FECHAS_RESALTADAS.length,
      'form rows:',
      this.eventosResaltados.length
    );

    // MODAL PARA AGREGAR UNA FECHA
    this.modalForm = this.fb.group({
      metaId: [null, Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: [''],
    });
  }

  get eventosResaltados(): FormArray {
    return this.calendarForm.get('eventosResaltados') as FormArray;
  }

  get eventosNoResaltados(): FormArray {
    return this.calendarForm.get('eventosNoResaltados') as FormArray;
  }

  // OPCIONES DISPONIBLES PARA EL MODAL (EVITA DUPLICADOS)
  get opcionesNoResaltadas() {
    const usados = new Set(
      this.eventosNoResaltados.controls.map((g) => g.get('metaId')?.value)
    );
    return this.FECHAS_NO_RESALTADAS.filter((m) => !usados.has(m.id));
  }

  // MODAL CONTROLS
  openModalNoResaltadas(): void {
    this.modalForm.reset({ metaId: null, fechaInicio: '', fechaFin: '' });
    this.modalOpen = true;
  }
  closeModalNoResaltadas(): void {
    this.modalOpen = false;
  }

  // CONFIRMAR AGREGACION DESDE EL MODAL
  addNoResaltadaFromModal(): void {
    if (this.modalForm.invalid) return;

    const { metaId, fechaInicio, fechaFin } = this.modalForm.value;
    const meta = this.FECHAS_NO_RESALTADAS.find((m) => m.id === metaId);
    if (!meta) return;

    // Cada fila guarda el meta y las fechas
    const group = this.fb.group({
      metaId: [meta.id],
      titulo: [meta.titulo],
      categoria: [meta.categoria], // "NO_RESALTADA"
      fechaInicio: [fechaInicio, Validators.required],
      fechaFin: [fechaFin],
    });

    this.eventosNoResaltados.push(group);
    this.closeModalNoResaltadas();
  }

  removeNoResaltada(index: number): void {
    this.eventosNoResaltados.removeAt(index);
  }

  // AGREGAR FECHAS ADICIONALES DE FORMA MANUAL (OPCIONAL)
  addEventoResaltado(): void {
    this.eventosResaltados.push(
      this.fb.group({
        fechaInicio: ['', Validators.required],
        fechaFin: [''],
      })
    );
  }

  isDestacado(i: number): boolean {
    const meta: any = this.FECHAS_RESALTADAS[i];
    return !!(meta?.destacado ?? meta?.destacadas);
  }

  removeEventoResaltado(index: number): void {
    this.eventosResaltados.removeAt(index);
  }

  onSubmit(): void {
    if (this.calendarForm.invalid) return;

    const v = this.calendarForm.value;

    // 1) Armar eventos resaltados
    const eventosRes = v.eventosResaltados.map((ev: any, i: number) => ({
      ...this.FECHAS_RESALTADAS[i],
      ...ev,
    }));

    // 2) Eventos no resaltados ya traen metadatos (titulo/categoria) y fechas
    const eventosNoRes = v.eventosNoResaltados;

    const calendario: CalendarioAcademico = {
      acuerdoAcademico: v.acuerdoAcademico,
      id: Date.now(),
      anio: v.anio,
      periodo: v.periodo,
      estado: v.estado,
      eventos: [...eventosRes, ...eventosNoRes],
    };

    console.log('Calendario creado:', calendario);
  }
}
