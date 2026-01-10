import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAsignarDocenteComponent } from './modal-asignar-docente.component';

describe('ModalAsignarDocenteComponent', () => {
  let component: ModalAsignarDocenteComponent;
  let fixture: ComponentFixture<ModalAsignarDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAsignarDocenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAsignarDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
