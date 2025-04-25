import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReponsibilitiesEditFormComponent } from './reponsibilities-edit-form.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';

describe('ReponsibilitiesEditFormComponent', () => {
  let component: ReponsibilitiesEditFormComponent;
  let fixture: ComponentFixture<ReponsibilitiesEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ReponsibilitiesEditFormComponent,
      ],
      providers: [
        provideRouter([]), // Provide an empty router for testing
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReponsibilitiesEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
