import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepAtributosComponent } from './step-atributos.component';

describe('StepAtributosComponent', () => {
  let component: StepAtributosComponent;
  let fixture: ComponentFixture<StepAtributosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepAtributosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepAtributosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
