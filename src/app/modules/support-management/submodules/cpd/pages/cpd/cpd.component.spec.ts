import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpdComponent } from './cpd.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../../../../../environments/environments_sgd';

describe('CpdComponent', () => {
  let component: CpdComponent;
  let fixture: ComponentFixture<CpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        CpdComponent,
        AngularFireModule.initializeApp(environment.firebaseConfig),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
