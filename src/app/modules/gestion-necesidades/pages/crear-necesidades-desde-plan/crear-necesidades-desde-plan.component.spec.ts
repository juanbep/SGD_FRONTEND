import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNecesidadesDesdePlanComponent } from './crear-necesidades-desde-plan.component';

describe('CrearNecesidadesDesdePlanComponent', () => {
  let component: CrearNecesidadesDesdePlanComponent;
  let fixture: ComponentFixture<CrearNecesidadesDesdePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearNecesidadesDesdePlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearNecesidadesDesdePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
