import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarMateriaModalComponent } from './eliminar-materia-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { Materia } from '../../../models/materia.models';

describe('EliminarMateriaModalComponent', () => {
  let component: EliminarMateriaModalComponent;
  let fixture: ComponentFixture<EliminarMateriaModalComponent>;

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
        EliminarMateriaModalComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EliminarMateriaModalComponent);
    component = fixture.componentInstance;

    component.materia = mockMateria;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
