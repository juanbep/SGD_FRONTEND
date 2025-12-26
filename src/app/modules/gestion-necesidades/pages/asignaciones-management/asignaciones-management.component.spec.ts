import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionesManagementComponent } from './asignaciones-management.component';

describe('AsignacionesManagementComponent', () => {
  let component: AsignacionesManagementComponent;
  let fixture: ComponentFixture<AsignacionesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignacionesManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignacionesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
