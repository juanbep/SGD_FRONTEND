import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearEditarNecesidadComponent } from './modal-crear-editar-necesidad.component';

describe('ModalCrearEditarNecesidadComponent', () => {
  let component: ModalCrearEditarNecesidadComponent;
  let fixture: ComponentFixture<ModalCrearEditarNecesidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCrearEditarNecesidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCrearEditarNecesidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
