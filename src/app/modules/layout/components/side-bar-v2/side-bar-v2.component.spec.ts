import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarV2Component } from './side-bar-v2.component';

describe('SideBarV2Component', () => {
  let component: SideBarV2Component;
  let fixture: ComponentFixture<SideBarV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBarV2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(SideBarV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
