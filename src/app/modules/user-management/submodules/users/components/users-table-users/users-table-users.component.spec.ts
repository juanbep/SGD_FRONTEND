import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersTableUsersComponent } from './users-table-users.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('UsersTableUsersComponent', () => {
  let component: UsersTableUsersComponent;
  let fixture: ComponentFixture<UsersTableUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        UsersTableUsersComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersTableUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
