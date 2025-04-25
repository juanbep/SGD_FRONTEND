import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsolidatedTeacherTableComponent } from './consolidated-teacher-table.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire/compat';
import { environments } from '../../../../../../../environments/environments';
import { provideRouter } from '@angular/router';

describe('ConsolidatedTeacherTableComponent', () => {
  let component: ConsolidatedTeacherTableComponent;
  let fixture: ComponentFixture<ConsolidatedTeacherTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ConsolidatedTeacherTableComponent,
        AngularFireModule.initializeApp(environments.firebaseConfig)
      ],
        providers: [
            provideRouter   ([]), // Provide an empty router for testing
        ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsolidatedTeacherTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
