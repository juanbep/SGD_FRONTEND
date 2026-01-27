import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarV2Component } from './side-bar-v2.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
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

describe('SideBarV2Component', () => {
  let component: SideBarV2Component;
  let fixture: ComponentFixture<SideBarV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        SideBarV2Component,
      ],
      providers: [{ provide: AuthServiceService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SideBarV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
