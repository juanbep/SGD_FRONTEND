import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibilitieCoordinatorFormComponent } from './responsibilitie-coordinator-form.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ResponsibilitieCoordinatorFormComponent', () => {
  let component: ResponsibilitieCoordinatorFormComponent;
  let fixture: ComponentFixture<ResponsibilitieCoordinatorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
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
