import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigacionComponent } from './investigacion.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('InvestigacionComponent', () => {
  let component: InvestigacionComponent;
  let fixture: ComponentFixture<InvestigacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
