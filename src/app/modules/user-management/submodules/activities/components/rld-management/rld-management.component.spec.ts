import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RldManagementComponent } from './rld-management.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('RldManagementComponent', () => {
  let component: RldManagementComponent;
  let fixture: ComponentFixture<RldManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
