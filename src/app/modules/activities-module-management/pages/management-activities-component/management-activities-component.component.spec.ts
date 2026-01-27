import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementActivitiesComponentComponent } from './management-activities-component.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ManagementActivitiesComponentComponent', () => {
  let component: ManagementActivitiesComponentComponent;
  let fixture: ComponentFixture<ManagementActivitiesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ManagementActivitiesComponentComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagementActivitiesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
