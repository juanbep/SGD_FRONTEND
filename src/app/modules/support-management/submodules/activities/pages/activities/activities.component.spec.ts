import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitiesComponent } from './activities.component';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { environments } from '../../../../../../../environments/environments';

describe('ActivitiesComponent', () => {
  let component: ActivitiesComponent;
  let fixture: ComponentFixture<ActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ActivitiesComponent,
        ToastrModule.forRoot(),
        AngularFireModule.initializeApp(environments.firebaseConfig),
      ],
      providers: [
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
