import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosNecesidadesSecretarioComponent } from './filtros-necesidades-secretario.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('FiltrosNecesidadesSecretarioComponent', () => {
  let component: FiltrosNecesidadesSecretarioComponent;
  let fixture: ComponentFixture<FiltrosNecesidadesSecretarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
