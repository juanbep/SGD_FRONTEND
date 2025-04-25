import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideBarComponent } from './side-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { environments } from '../../../../../environments/environments';
import { RouterTestingModule } from '@angular/router/testing';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, AngularFireModule.initializeApp(environments.firebaseConfig), RouterTestingModule, SideBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});