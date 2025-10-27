import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepAsignarUsuariosComponent } from './step-asignar-usuarios.component';

describe('StepAsignarUsuariosComponent', () => {
  let component: StepAsignarUsuariosComponent;
  let fixture: ComponentFixture<StepAsignarUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepAsignarUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepAsignarUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
