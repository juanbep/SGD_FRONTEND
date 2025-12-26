import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarPlanModalComponent } from './eliminar-plan-modal.component';

describe('EliminarPlanModalComponent', () => {
  let component: EliminarPlanModalComponent;
  let fixture: ComponentFixture<EliminarPlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminarPlanModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EliminarPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
