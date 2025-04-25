import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersTableUsersComponent } from './users-table-users.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('UsersTableUsersComponent', () => {
  let component: UsersTableUsersComponent;
  let fixture: ComponentFixture<UsersTableUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
