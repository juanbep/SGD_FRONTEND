import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajosDocenciaComponent } from './trabajos-docencia.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('TrabajosDocenciaComponent', () => {
  let component: TrabajosDocenciaComponent;
  let fixture: ComponentFixture<TrabajosDocenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        TrabajosDocenciaComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrabajosDocenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
