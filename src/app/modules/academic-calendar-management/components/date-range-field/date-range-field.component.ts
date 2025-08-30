import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import dayjs, { Dayjs } from 'dayjs';

export type DateRanges = { [label: string]: [Dayjs, Dayjs] };

@Component({
  selector: 'app-date-range-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxDaterangepickerMd],
  templateUrl: './date-range-field.component.html',
  styleUrl: './date-range-field.component.css',
})
export class DateRangeFieldComponent {
  @Input({ required: true }) group!: AbstractControl;
  @Input() startKey = 'fechaInicio';
  @Input() endKey = 'fechaFin';

  @Input() placeholder = 'Selecciona fecha(s)';
  @Input() hint = '';
  @Input() disabled = false;
  @Input() autoApply = true;
  @Input() linkedCalendars = false;
  @Input() showDropdowns = true;

  private _ranges: DateRanges = {
    Hoy: [dayjs(), dayjs()],
    Mañana: [dayjs().add(1, 'day'), dayjs().add(1, 'day')],
  };
  @Input() set ranges(val: DateRanges | null | undefined) {
    this._ranges = val ?? ({} as DateRanges);
  }
  get resolvedRanges(): DateRanges {
    return this._ranges;
  }

  @Input() locale: any = {
    format: 'DD/MM/YYYY',
    separator: ' - ',
    applyLabel: 'Aplicar',
    cancelLabel: 'Cancelar',
    fromLabel: 'Desde',
    toLabel: 'Hasta',
    customRangeLabel: 'Personalizado',
    daysOfWeek: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
    monthNames: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    firstDay: 1,
  };

  @Output() rangeChange = new EventEmitter<{
    start: Date | null;
    end: Date | null;
  }>();

  onChoose(e: any): void {
   
    const toDate = (v: any): Date | null => {
      if (!v) return null;
      if (v.toDate) return v.toDate(); // Dayjs/Moment
      if (v instanceof Date) return v;
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d;
    };


    const start = toDate(e?.startDate ?? e?.start ?? e?.[0]);
    const end = toDate(
      e?.endDate ?? e?.end ?? e?.[1] ?? e?.startDate ?? e?.start ?? e?.[0]
    );

    this.group.get(this.startKey)?.setValue(start);
    this.group.get(this.endKey)?.setValue(end);
    this.group.get(this.startKey)?.markAsDirty();
    this.group.get(this.endKey)?.markAsDirty();

    this.rangeChange.emit({ start, end });
  }
}
