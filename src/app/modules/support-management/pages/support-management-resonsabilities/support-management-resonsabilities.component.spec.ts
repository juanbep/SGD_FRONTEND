import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportManagementResonsabilitiesComponent } from './support-management-resonsabilities.component';

describe('SupportManagementResonsabilitiesComponent', () => {
  let component: SupportManagementResonsabilitiesComponent;
  let fixture: ComponentFixture<SupportManagementResonsabilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportManagementResonsabilitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportManagementResonsabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
