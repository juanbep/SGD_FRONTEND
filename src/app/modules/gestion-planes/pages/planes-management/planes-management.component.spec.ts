import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanesManagementComponent } from './planes-management.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('PlanesManagementComponent', () => {
  let component: PlanesManagementComponent;
  let fixture: ComponentFixture<PlanesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        PlanesManagementComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
