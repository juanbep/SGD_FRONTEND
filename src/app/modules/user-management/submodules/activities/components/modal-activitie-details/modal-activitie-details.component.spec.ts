import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalActivitieDetailsComponent } from './modal-activitie-details.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ModalActivitieDetailsComponent', () => {
  let component: ModalActivitieDetailsComponent;
  let fixture: ComponentFixture<ModalActivitieDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ModalActivitieDetailsComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalActivitieDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
