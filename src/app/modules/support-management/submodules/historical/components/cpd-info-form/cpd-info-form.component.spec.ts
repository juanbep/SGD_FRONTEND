import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpdInfoFormComponent } from './cpd-info-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('CpdInfoFormComponent', () => {
  let component: CpdInfoFormComponent;
  let fixture: ComponentFixture<CpdInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), CpdInfoFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CpdInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
