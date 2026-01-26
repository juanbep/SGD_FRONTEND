import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNecesidadDetailComponent } from './view-necesidad-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ViewNecesidadDetailComponent', () => {
  let component: ViewNecesidadDetailComponent;
  let fixture: ComponentFixture<ViewNecesidadDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ViewNecesidadDetailComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewNecesidadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
