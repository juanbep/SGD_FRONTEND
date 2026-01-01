import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosNecesidadesSecretarioComponent } from './filtros-necesidades-secretario.component';

describe('FiltrosNecesidadesSecretarioComponent', () => {
  let component: FiltrosNecesidadesSecretarioComponent;
  let fixture: ComponentFixture<FiltrosNecesidadesSecretarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosNecesidadesSecretarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosNecesidadesSecretarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
