import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosNecesidadesComponent } from './filtros-necesidades.component';

describe('FiltrosNecesidadesComponent', () => {
  let component: FiltrosNecesidadesComponent;
  let fixture: ComponentFixture<FiltrosNecesidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosNecesidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosNecesidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
