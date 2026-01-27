import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalUserDetailslComponent } from './modal-user-details.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ModalUserDetailsComponent', () => {
  let component: ModalUserDetailslComponent;
  let fixture: ComponentFixture<ModalUserDetailslComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ModalUserDetailslComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalUserDetailslComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
