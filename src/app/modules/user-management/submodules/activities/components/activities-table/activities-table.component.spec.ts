import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitiesTableComponent } from './activities-table.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';

describe('ActivitiesTableComponent', () => {
  let component: ActivitiesTableComponent;
  let fixture: ComponentFixture<ActivitiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ActivitiesTableComponent,
      ],
      providers: [
        provideRouter([]), // Provide an empty router for testing
      ],
      
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
