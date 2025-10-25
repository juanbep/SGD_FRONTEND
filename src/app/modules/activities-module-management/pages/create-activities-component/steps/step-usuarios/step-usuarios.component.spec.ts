import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepUsuariosComponent } from './step-usuarios.component';

describe('StepUsuariosComponent', () => {
  let component: StepUsuariosComponent;
  let fixture: ComponentFixture<StepUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
