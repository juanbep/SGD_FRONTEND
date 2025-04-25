import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ActivatedRoute, provideRouter, RouterModule } from '@angular/router';
import { provideProtractorTestingSupport } from '@angular/platform-browser';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersComponent, ToastrModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: ActivatedRoute }, 
        provideHttpClient(), // Provide HttpClient for testing
        provideRouter([]), // Provide an empty router for testing
        provideHttpClientTesting(), // Provide HttpClientTesting for testing
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
