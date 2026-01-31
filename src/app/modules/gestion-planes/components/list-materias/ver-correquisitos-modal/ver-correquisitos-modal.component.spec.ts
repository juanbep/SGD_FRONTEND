import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCorrequisitosModalComponent } from './ver-correquisitos-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { Materia } from '../../../models/materia.models';

describe('VerCorrequisitosModalComponent', () => {
  let component: VerCorrequisitosModalComponent;
  let fixture: ComponentFixture<VerCorrequisitosModalComponent>;

  // Mock de materia
  const mockMateria: Materia = {
    idMateria: 1,
    oidMateria: 'OID-MAT-001',
    codigo: 'MAT-101',
    nombre: 'Cálculo I',
    semestre: 1,
    horasSemana: 4,
    oidDepartamento: 10,
    nombreDepartamento: 'Departamento de Matemáticas',
    oidPlan: 100,
    numeroPlan: 'PLAN-2024-001',
    idCorrequisito: null,
    oidCorrequisito: null,
    nombreCorrequisito: null,
    fechaCreacion: '2024-01-10',
    usuarioCreacion: 'admin',
    fechaActualizacion: null,
    usuarioActualizacion: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        VerCorrequisitosModalComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerCorrequisitosModalComponent);
    component = fixture.componentInstance;

    component.materia = mockMateria;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
