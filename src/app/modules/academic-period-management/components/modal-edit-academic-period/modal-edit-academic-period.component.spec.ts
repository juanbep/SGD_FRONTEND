import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalEditAcademicPeriodComponent } from './modal-edit-academic-period.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ModalEditAcademicPeriodComponent', () => {
  let component: ModalEditAcademicPeriodComponent;
  let fixture: ComponentFixture<ModalEditAcademicPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ModalEditAcademicPeriodComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEditAcademicPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
