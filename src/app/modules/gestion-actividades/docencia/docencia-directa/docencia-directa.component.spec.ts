import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaDirectaComponent } from './docencia-directa.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('DocenciaDirectaComponent', () => {
  let component: DocenciaDirectaComponent;
  let fixture: ComponentFixture<DocenciaDirectaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        DocenciaDirectaComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocenciaDirectaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
