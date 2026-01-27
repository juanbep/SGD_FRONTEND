import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosNecesidadesSecretarioComponent } from './filtros-necesidades-secretario.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('FiltrosNecesidadesSecretarioComponent', () => {
  let component: FiltrosNecesidadesSecretarioComponent;
  let fixture: ComponentFixture<FiltrosNecesidadesSecretarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        FiltrosNecesidadesSecretarioComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltrosNecesidadesSecretarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
