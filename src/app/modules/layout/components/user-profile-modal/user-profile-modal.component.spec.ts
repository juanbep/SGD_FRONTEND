import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileModalComponent } from './user-profile-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { AuthServiceService } from '../../../auth/service/auth-service.service';

// Mock AuthService
const mockAuthService = jasmine.createSpyObj(
  'AuthServiceService',
  ['getUser', 'logout'],
  {
    user$: of(null),
    currentUser: null,
  },
);

describe('UserProfileModalComponent', () => {
  let component: UserProfileModalComponent;
  let fixture: ComponentFixture<UserProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        UserProfileModalComponent,
      ],
      providers: [{ provide: AuthServiceService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
