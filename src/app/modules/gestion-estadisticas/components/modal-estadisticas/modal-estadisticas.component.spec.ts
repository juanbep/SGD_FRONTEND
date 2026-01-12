import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEstadisticasComponent } from './modal-estadisticas.component';

describe('ModalEstadisticasComponent', () => {
  let component: ModalEstadisticasComponent;
  let fixture: ComponentFixture<ModalEstadisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEstadisticasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEstadisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
