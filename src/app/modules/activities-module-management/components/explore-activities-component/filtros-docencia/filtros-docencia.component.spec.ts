import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosDocenciaComponent } from './filtros-docencia.component';

describe('FiltrosDocenciaComponent', () => {
  let component: FiltrosDocenciaComponent;
  let fixture: ComponentFixture<FiltrosDocenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosDocenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosDocenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
