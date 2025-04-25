import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponsibilitiesFilterComponent } from './responsibilities-filter.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ResponsibilitiesFilterComponent', () => {
  let component: ResponsibilitiesFilterComponent;
  let fixture: ComponentFixture<ResponsibilitiesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ResponsibilitiesFilterComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsibilitiesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
