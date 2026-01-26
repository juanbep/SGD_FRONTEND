import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesBaseComponent } from './activities-base.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ActivitiesBaseComponent', () => {
  let component: ActivitiesBaseComponent;
  let fixture: ComponentFixture<ActivitiesBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ActivitiesBaseComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
