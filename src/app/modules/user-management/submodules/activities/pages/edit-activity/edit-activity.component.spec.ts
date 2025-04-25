import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditActivityComponent } from './edit-activity.component';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('EditActivityComponent', () => {
  let component: EditActivityComponent;
  let fixture: ComponentFixture<EditActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot(), EditActivityComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])], 
    }).compileComponents();

    fixture = TestBed.createComponent(EditActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
