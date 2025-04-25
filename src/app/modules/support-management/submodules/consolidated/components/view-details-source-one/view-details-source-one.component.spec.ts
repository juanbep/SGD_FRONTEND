import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewDetailsSourceOneComponent } from './view-details-source-one.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ViewDetailsSourceOneComponent', () => {
  let component: ViewDetailsSourceOneComponent;
  let fixture: ComponentFixture<ViewDetailsSourceOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ViewDetailsSourceOneComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDetailsSourceOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
