import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeachersListComponent } from './teachers-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { environments } from '../../../../../../../environments/environments';

describe('TeachersListComponent', () => {
  let component: TeachersListComponent;
  let fixture: ComponentFixture<TeachersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        TeachersListComponent,
        AngularFireModule.initializeApp(environments.firebaseConfig),
      ],
      providers: [
        provideRouter([]), // Provide an empty router for testing
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TeachersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
