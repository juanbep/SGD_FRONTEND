import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPlanModalComponentComponent } from './editar-plan-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('EditarPlanModalComponentComponent', () => {
  let component: EditarPlanModalComponentComponent;
  let fixture: ComponentFixture<EditarPlanModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        EditarPlanModalComponentComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPlanModalComponentComponent);
    component = fixture.componentInstance;

    component.plan = {
      numero: 1,
      estado: 'ACTIVO',
      fechaAprobacion: '2025-01-01',
      acuerdo: 'Acuerdo de prueba',
      oidPrograma: 123,
      oidPlan: 456,
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
