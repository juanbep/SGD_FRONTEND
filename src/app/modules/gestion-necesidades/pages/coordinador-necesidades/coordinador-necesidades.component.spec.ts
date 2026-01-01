import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinadorNecesidadesComponent } from './coordinador-necesidades.component';

describe('CoordinadorNecesidadesComponent', () => {
  let component: CoordinadorNecesidadesComponent;
  let fixture: ComponentFixture<CoordinadorNecesidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinadorNecesidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinadorNecesidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
