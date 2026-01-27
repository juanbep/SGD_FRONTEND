import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewDetailsSourceTwoComponent } from './view-details-source-two.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ViewDetailsSourceTwoComponent', () => {
  let component: ViewDetailsSourceTwoComponent;
  let fixture: ComponentFixture<ViewDetailsSourceTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ViewDetailsSourceTwoComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewDetailsSourceTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
