import { Component, EventEmitter, input, Output, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

interface NeedRow {
  oid: string;
  codigo: string;
  nombre: string;
  semestre: string;
  grupo: string;
  cupo: number;
  horasSemanales: number;
  periodoOid?: string;
}

export interface EditNeedData {
  grupo: string;
  cupo: number;
  horasSemanales: number;
}

@Component({
  selector: 'app-edit-need-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-need-modal.component.html',
  styleUrl: './edit-need-modal.component.css',
})
export class EditNeedModalComponent {
  visible = input<boolean>(false);
  necesidad = input<NeedRow | null>(null);
  
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<EditNeedData>();

  editForm: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.editForm = this.fb.group({
      grupo: [''],
      cupo: [0],
      horasSemanales: [0],
    });

    // Effect para sincronizar cuando cambie la necesidad
    effect(() => {
      const nec = this.necesidad();
      if (nec) {
        this.editForm.patchValue({
          grupo: nec.grupo,
          cupo: nec.cupo,
          horasSemanales: nec.horasSemanales,
        });
      }
    }, { allowSignalWrites: true });
  }

  onCerrar(): void {
    this.editForm.reset({ grupo: '', cupo: 0, horasSemanales: 0 });
    this.cerrar.emit();
  }

  onGuardar(): void {
    const valores = this.editForm.value;
    this.guardar.emit({
      grupo: valores.grupo,
      cupo: +valores.cupo,
      horasSemanales: +valores.horasSemanales,
    });
    this.onCerrar();
  }
}
