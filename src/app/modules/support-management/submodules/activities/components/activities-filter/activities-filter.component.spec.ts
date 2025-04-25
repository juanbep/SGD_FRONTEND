import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitiesFilterComponent } from './activities-filter.component';
import { HttpClientModule } from '@angular/common/http';

describe('ActivitiesFilterComponent', () => {
  let component: ActivitiesFilterComponent;
  let fixture: ComponentFixture<ActivitiesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ActivitiesFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});