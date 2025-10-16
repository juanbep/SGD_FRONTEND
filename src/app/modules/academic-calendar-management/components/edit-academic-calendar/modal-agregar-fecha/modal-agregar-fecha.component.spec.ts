import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarFechaComponent } from './modal-agregar-fecha.component';

describe('ModalAgregarFechaComponent', () => {
  let component: ModalAgregarFechaComponent;
  let fixture: ComponentFixture<ModalAgregarFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAgregarFechaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAgregarFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
