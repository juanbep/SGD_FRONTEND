import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefeSeleccionadosComponent } from './jefe-seleccionados.component';

describe('JefeSeleccionadosComponent', () => {
  let component: JefeSeleccionadosComponent;
  let fixture: ComponentFixture<JefeSeleccionadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JefeSeleccionadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JefeSeleccionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
