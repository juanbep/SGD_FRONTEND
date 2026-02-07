import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosDocenciaComponent } from './filtros-docencia.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('FiltrosDocenciaComponent', () => {
  let component: FiltrosDocenciaComponent;
  let fixture: ComponentFixture<FiltrosDocenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        FiltrosDocenciaComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltrosDocenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
