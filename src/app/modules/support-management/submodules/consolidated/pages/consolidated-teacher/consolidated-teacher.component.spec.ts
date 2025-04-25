import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsolidatedTeacherComponent } from './consolidated-teacher.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { environments } from '../../../../../../../environments/environments';

describe('ConsolidatedTeacherComponent', () => {
  let component: ConsolidatedTeacherComponent;
  let fixture: ComponentFixture<ConsolidatedTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ConsolidatedTeacherComponent,
        AngularFireModule.initializeApp(environments.firebaseConfig)
      ],
      providers: [
        provideRouter([]), // Provide an empty router for testing
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsolidatedTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
