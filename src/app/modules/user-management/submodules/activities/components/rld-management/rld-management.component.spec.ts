import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RldManagementComponent } from './rld-management.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('RldManagementComponent', () => {
  let component: RldManagementComponent;
  let fixture: ComponentFixture<RldManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        RldManagementComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RldManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
