import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NecesidadesManagementComponent } from './necesidades-management.component';

describe('NecesidadesManagementComponent', () => {
  let component: NecesidadesManagementComponent;
  let fixture: ComponentFixture<NecesidadesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NecesidadesManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NecesidadesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
