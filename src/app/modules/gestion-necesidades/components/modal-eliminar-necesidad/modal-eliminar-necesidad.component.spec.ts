import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarNecesidadComponent } from './modal-eliminar-necesidad.component';

describe('ModalEliminarNecesidadComponent', () => {
  let component: ModalEliminarNecesidadComponent;
  let fixture: ComponentFixture<ModalEliminarNecesidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEliminarNecesidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEliminarNecesidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
