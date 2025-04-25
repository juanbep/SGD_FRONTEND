import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpdComponent } from './cpd.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire/compat';
import { environments } from '../../../../../../../environments/environments';

describe('CpdComponent', () => {
  let component: CpdComponent;
  let fixture: ComponentFixture<CpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot(), CpdComponent, AngularFireModule.initializeApp(environments.firebaseConfig)],

    }).compileComponents();

    fixture = TestBed.createComponent(CpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
