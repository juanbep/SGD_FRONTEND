import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailComponent } from './email.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('EmailComponent', () => {
  let component: EmailComponent;
  let fixture: ComponentFixture<EmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot(), EmailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});