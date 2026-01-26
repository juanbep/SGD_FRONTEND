import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibilitiesEditCoordinatorFormComponent } from './responsibilities-edit-coordinator-form.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ResponsibilitiesEditCoordinatorFormComponent', () => {
  let component: ResponsibilitiesEditCoordinatorFormComponent;
  let fixture: ComponentFixture<ResponsibilitiesEditCoordinatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
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
