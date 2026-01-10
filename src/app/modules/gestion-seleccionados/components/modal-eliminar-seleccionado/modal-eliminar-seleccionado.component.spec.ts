import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarSeleccionadoComponent } from './modal-eliminar-seleccionado.component';

describe('ModalEliminarSeleccionadoComponent', () => {
  let component: ModalEliminarSeleccionadoComponent;
  let fixture: ComponentFixture<ModalEliminarSeleccionadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEliminarSeleccionadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEliminarSeleccionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
