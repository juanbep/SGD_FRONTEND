import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosBaseComponent } from './filtros-base.component';

describe('FiltrosBaseComponent', () => {
  let component: FiltrosBaseComponent;
  let fixture: ComponentFixture<FiltrosBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
