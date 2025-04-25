import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersFilterComponent } from './users-filter.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('UsersFilterComponent', () => {
  let component: UsersFilterComponent;
  let fixture: ComponentFixture<UsersFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot(), UsersFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
