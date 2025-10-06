import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarActividadComponent } from './modal-eliminar-actividad.component';

describe('ModalEliminarActividadComponent', () => {
  let component: ModalEliminarActividadComponent;
  let fixture: ComponentFixture<ModalEliminarActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEliminarActividadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEliminarActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
