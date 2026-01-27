import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponsibilitiesTableComponent } from './responsibilities-table.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ResponsibilitiesTableComponent', () => {
  let component: ResponsibilitiesTableComponent;
  let fixture: ComponentFixture<ResponsibilitiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ResponsibilitiesTableComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsibilitiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
