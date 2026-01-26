import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileModalComponent } from './user-profile-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('UserProfileModalComponent', () => {
  let component: UserProfileModalComponent;
  let fixture: ComponentFixture<UserProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        UserProfileModalComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
