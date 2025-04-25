import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewActivityComponent } from './new-activity.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';

describe('NewActivityComponent', () => {
  let component: NewActivityComponent;
  let fixture: ComponentFixture<NewActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot(), NewActivityComponent],
      providers: [
        provideRouter([]), // Provide an empty router for testing
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
