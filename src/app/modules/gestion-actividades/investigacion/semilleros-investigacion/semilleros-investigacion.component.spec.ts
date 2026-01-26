import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemillerosInvestigacionComponent } from './semilleros-investigacion.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('SemillerosInvestigacionComponent', () => {
  let component: SemillerosInvestigacionComponent;
  let fixture: ComponentFixture<SemillerosInvestigacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
