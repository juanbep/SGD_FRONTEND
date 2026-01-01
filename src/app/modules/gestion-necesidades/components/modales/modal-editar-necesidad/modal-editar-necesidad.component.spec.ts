import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarNecesidadComponent } from './modal-editar-necesidad.component';

describe('ModalEditarNecesidadComponent', () => {
  let component: ModalEditarNecesidadComponent;
  let fixture: ComponentFixture<ModalEditarNecesidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarNecesidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarNecesidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
