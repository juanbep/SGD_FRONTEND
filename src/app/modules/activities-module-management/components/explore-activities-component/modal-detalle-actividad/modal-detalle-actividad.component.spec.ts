import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleActividadComponent } from './modal-detalle-actividad.component';

describe('ModalDetalleActividadComponent', () => {
  let component: ModalDetalleActividadComponent;
  let fixture: ComponentFixture<ModalDetalleActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDetalleActividadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDetalleActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
