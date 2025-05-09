import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CpdInfoFormComponent } from './cpd-info-form.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('CpdInfoFormComponent', () => {
  let component: CpdInfoFormComponent;
  let fixture: ComponentFixture<CpdInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot(), CpdInfoFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CpdInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
