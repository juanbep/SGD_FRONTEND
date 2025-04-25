import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponsibilitiesTableComponent } from './responsibilities-table.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ResponsibilitiesTableComponent', () => {
  let component: ResponsibilitiesTableComponent;
  let fixture: ComponentFixture<ResponsibilitiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
