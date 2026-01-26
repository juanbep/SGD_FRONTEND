import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementActivitiesComponentComponent } from './management-activities-component.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ManagementActivitiesComponentComponent', () => {
  let component: ManagementActivitiesComponentComponent;
  let fixture: ComponentFixture<ManagementActivitiesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
