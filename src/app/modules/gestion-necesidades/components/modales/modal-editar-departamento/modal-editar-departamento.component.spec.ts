import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarDepartamentoComponent } from './modal-editar-departamento.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { Materia, NecesidadResponse } from '../../../models/necesidad.model';

describe('ModalEditarDepartamentoComponent', () => {
  let component: ModalEditarDepartamentoComponent;
  let fixture: ComponentFixture<ModalEditarDepartamentoComponent>;

  // Mock de Materia
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
    fechaActualizacion: '2024-01-10',
    usuarioActualizacion: 'admin',
  };

  // Mock de NecesidadResponse
  const mockNecesidad: NecesidadResponse = {
    oidNecesidad: 1,
    oidCalendario: 100,
    anioCalendario: '2024',
    numeroCalendario: 1,
    idMateria: 1,
    oidMateria: 'OID-MAT-001',
    codigoMateria: 'MAT-101',
    nombreMateria: 'Cálculo I',
    semestreMateria: 1,
    materia: mockMateria,
    grupo: 'A',
    cupo: 30,
    estado: 'ACTIVO',
    estadoDescripcion: 'Activo',
    correquisitoOidNecesidad: null,
    correquisitoNombreMateria: null,
    fechaCreacion: '2024-01-10',
    usuarioCreacion: 'admin',
    fechaActualizacion: '2024-01-10',
    usuarioActualizacion: 'admin',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ModalEditarDepartamentoComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEditarDepartamentoComponent);
    component = fixture.componentInstance;

    component.necesidad = mockNecesidad;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
