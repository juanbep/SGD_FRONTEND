import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarPlanModalComponent } from './eliminar-plan-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { Plan } from '../../models';

describe('EliminarPlanModalComponent', () => {
  let component: EliminarPlanModalComponent;
  let fixture: ComponentFixture<EliminarPlanModalComponent>;

  const mockPlan: Plan = {
    oidPlan: 1,
    numero: 12345,
    estado: 'ACTIVO',
    fechaAprobacion: '2024-01-15',
    acuerdo: 'ACU-001-2024',
    oidPrograma: 10,
    nombrePrograma: 'Ingeniería de Sistemas',
    cantidadMaterias: 50,
    fechaCreacion: '2024-01-10',
    fechaActualizacion: '2024-01-15',
    usuarioCreacion: 'admin',
    usuarioActualizacion: 'admin',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        EliminarPlanModalComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EliminarPlanModalComponent);
    component = fixture.componentInstance;

    component.plan = mockPlan;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
