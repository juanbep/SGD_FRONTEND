import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretarioNecesidadesComponent } from './secretario-necesidades.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('SecretarioNecesidadesComponent', () => {
  let component: SecretarioNecesidadesComponent;
  let fixture: ComponentFixture<SecretarioNecesidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
