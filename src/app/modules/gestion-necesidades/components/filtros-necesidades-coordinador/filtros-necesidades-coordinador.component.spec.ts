import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosNecesidadesCoordinadorComponent } from './filtros-necesidades-coordinador.component';

describe('FiltrosNecesidadesComponent', () => {
  let component: FiltrosNecesidadesCoordinadorComponent;
  let fixture: ComponentFixture<FiltrosNecesidadesCoordinadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosNecesidadesCoordinadorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltrosNecesidadesCoordinadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
