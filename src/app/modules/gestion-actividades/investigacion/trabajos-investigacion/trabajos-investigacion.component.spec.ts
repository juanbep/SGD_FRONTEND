import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajosInvestigacionComponent } from './trabajos-investigacion.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TrabajosInvestigacionComponent', () => {
  let component: TrabajosInvestigacionComponent;
  let fixture: ComponentFixture<TrabajosInvestigacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        TrabajosInvestigacionComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrabajosInvestigacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
