import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesPendingDefinitionEvaluatorComponent } from './activities-pending-definition-evaluator.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { AuthServiceService } from '../../../../../auth/service/auth-service.service';

// Mock AuthService
const mockAuthService = jasmine.createSpyObj(
  'AuthServiceService',
  ['getUser', 'logout'],
  {
    user$: of(null),
    currentUser: null,
  },
);

describe('ActivitiesPendingDefinitionEvaluatorComponent', () => {
  let component: ActivitiesPendingDefinitionEvaluatorComponent;
  let fixture: ComponentFixture<ActivitiesPendingDefinitionEvaluatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ActivitiesPendingDefinitionEvaluatorComponent,
      ],
      providers: [{ provide: AuthServiceService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ActivitiesPendingDefinitionEvaluatorComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
