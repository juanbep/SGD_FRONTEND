import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPageComponent } from './login-page.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { environments } from '../../../../../environments/environments'; 
import { ToastrModule } from 'ngx-toastr';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, AngularFireModule.initializeApp(environments.firebaseConfig), ToastrModule.forRoot(), LoginPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});