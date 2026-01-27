import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibilitieCoordinatorFormComponent } from './responsibilitie-coordinator-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';

describe('ResponsibilitieCoordinatorFormComponent', () => {
  let component: ResponsibilitieCoordinatorFormComponent;
  let fixture: ComponentFixture<ResponsibilitieCoordinatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        RouterTestingModule,
        ResponsibilitieCoordinatorFormComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsibilitieCoordinatorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
