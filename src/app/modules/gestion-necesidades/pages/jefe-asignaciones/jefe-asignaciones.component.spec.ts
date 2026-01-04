import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefeAsignacionesComponent } from './jefe-asignaciones.component';

describe('JefeAsignacionesComponent', () => {
  let component: JefeAsignacionesComponent;
  let fixture: ComponentFixture<JefeAsignacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JefeAsignacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JefeAsignacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
