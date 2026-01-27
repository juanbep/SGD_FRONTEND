import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesBaseComponent } from './activities-base.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('ActivitiesBaseComponent', () => {
  let component: ActivitiesBaseComponent;
  let fixture: ComponentFixture<ActivitiesBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
