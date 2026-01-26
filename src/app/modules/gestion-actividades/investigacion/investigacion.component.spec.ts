import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigacionComponent } from './investigacion.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('InvestigacionComponent', () => {
  let component: InvestigacionComponent;
  let fixture: ComponentFixture<InvestigacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        InvestigacionComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestigacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
