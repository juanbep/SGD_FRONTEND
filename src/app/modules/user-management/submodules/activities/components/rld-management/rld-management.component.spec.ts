import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RldManagementComponent } from './rld-management.component';

describe('RldManagementComponent', () => {
  let component: RldManagementComponent;
  let fixture: ComponentFixture<RldManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RldManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RldManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
