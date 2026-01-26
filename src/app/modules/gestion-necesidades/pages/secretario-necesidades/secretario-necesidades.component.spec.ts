import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretarioNecesidadesComponent } from './secretario-necesidades.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('SecretarioNecesidadesComponent', () => {
  let component: SecretarioNecesidadesComponent;
  let fixture: ComponentFixture<SecretarioNecesidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        SecretarioNecesidadesComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SecretarioNecesidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
