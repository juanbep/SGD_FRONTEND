import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPlanModalComponentComponent } from './editar-plan-modal-component.component';

describe('EditarPlanModalComponentComponent', () => {
  let component: EditarPlanModalComponentComponent;
  let fixture: ComponentFixture<EditarPlanModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPlanModalComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPlanModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
