import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSeleccionarCalendarioComponent } from './modal-seleccionar-calendario.component';

describe('ModalSeleccionarCalendarioComponent', () => {
  let component: ModalSeleccionarCalendarioComponent;
  let fixture: ComponentFixture<ModalSeleccionarCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSeleccionarCalendarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalSeleccionarCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
