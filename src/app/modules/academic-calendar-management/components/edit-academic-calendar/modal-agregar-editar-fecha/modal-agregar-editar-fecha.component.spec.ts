import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarEditarFechaComponent } from './modal-agregar-editar-fecha.component';

describe('ModalAgregarFechaComponent', () => {
  let component: ModalAgregarEditarFechaComponent;
  let fixture: ComponentFixture<ModalAgregarEditarFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAgregarEditarFechaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAgregarEditarFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
