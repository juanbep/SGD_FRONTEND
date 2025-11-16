import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtrosServiciosComponent } from './otros-servicios.component';

describe('OtrosServiciosComponent', () => {
  let component: OtrosServiciosComponent;
  let fixture: ComponentFixture<OtrosServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtrosServiciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtrosServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
