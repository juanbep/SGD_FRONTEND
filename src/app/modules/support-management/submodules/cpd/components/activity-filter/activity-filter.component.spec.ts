import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityFilterComponent } from './activity-filter.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ActivityFilterComponent', () => {
  let component: ActivityFilterComponent;
  let fixture: ComponentFixture<ActivityFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ActivityFilterComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
