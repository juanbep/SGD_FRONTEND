import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEliminarCalendarioComponent } from './modal-eliminar-calendario.component';

describe('ModalEliminarCalendarioComponent', () => {
  let component: ModalEliminarCalendarioComponent;
  let fixture: ComponentFixture<ModalEliminarCalendarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEliminarCalendarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEliminarCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
