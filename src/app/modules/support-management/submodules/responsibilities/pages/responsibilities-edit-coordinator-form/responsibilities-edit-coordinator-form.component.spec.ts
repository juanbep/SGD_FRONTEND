import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibilitiesEditCoordinatorFormComponent } from './responsibilities-edit-coordinator-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';

describe('ResponsibilitiesEditCoordinatorFormComponent', () => {
  let component: ResponsibilitiesEditCoordinatorFormComponent;
  let fixture: ComponentFixture<ResponsibilitiesEditCoordinatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        RouterTestingModule,
        ResponsibilitiesEditCoordinatorFormComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      ResponsibilitiesEditCoordinatorFormComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
