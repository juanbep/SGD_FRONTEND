import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeachersListFilterComponent } from './teachers-list-filter.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('TeachersListFilterComponent', () => {
  let component: TeachersListFilterComponent;
  let fixture: ComponentFixture<TeachersListFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        TeachersListFilterComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TeachersListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
