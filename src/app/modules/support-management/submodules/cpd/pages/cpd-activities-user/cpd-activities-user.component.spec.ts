import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpdActivitiesUserComponent } from './cpd-activities-user.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';

describe('CpdActivitiesUserComponent', () => {
  let component: CpdActivitiesUserComponent;
  let fixture: ComponentFixture<CpdActivitiesUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        CpdActivitiesUserComponent,
      ],
      providers: [
        provideRouter([]), // Provide an empty router for testing
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CpdActivitiesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
