import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemillerosInvestigacionComponent } from './semilleros-investigacion.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('SemillerosInvestigacionComponent', () => {
  let component: SemillerosInvestigacionComponent;
  let fixture: ComponentFixture<SemillerosInvestigacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        SemillerosInvestigacionComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SemillerosInvestigacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
