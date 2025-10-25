import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepDetallesTemporalesComponent } from './step-detalles-temporales.component';

describe('StepDetallesTemporalesComponent', () => {
  let component: StepDetallesTemporalesComponent;
  let fixture: ComponentFixture<StepDetallesTemporalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepDetallesTemporalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepDetallesTemporalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
