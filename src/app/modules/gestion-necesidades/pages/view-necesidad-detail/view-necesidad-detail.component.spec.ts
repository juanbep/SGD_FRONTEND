import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNecesidadDetailComponent } from './view-necesidad-detail.component';

describe('ViewNecesidadDetailComponent', () => {
  let component: ViewNecesidadDetailComponent;
  let fixture: ComponentFixture<ViewNecesidadDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewNecesidadDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewNecesidadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
