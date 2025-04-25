import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponsibilitiesComponent } from './responsibilities.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { environments } from '../../../../../../../environments/environments';

describe('ResponsibilitiesComponent', () => {
  let component: ResponsibilitiesComponent;
  let fixture: ComponentFixture<ResponsibilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ResponsibilitiesComponent,
        AngularFireModule.initializeApp(environments.firebaseConfig)
      ],
      providers: [
        provideRouter([]), // Provide an empty router for testing
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsibilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
