import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherListTableComponent } from './teachers-list-table.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { environments } from '../../../../../../../environments/environments';

describe('TeachersListTableComponent', () => {
  let component: TeacherListTableComponent;
  let fixture: ComponentFixture<TeacherListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        TeacherListTableComponent,
        AngularFireModule.initializeApp(environments.firebaseConfig)
      ],
      providers: [
        provideRouter([]), // Provide an empty router for testing
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
