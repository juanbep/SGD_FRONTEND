import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaComponent } from './docencia.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('DocenciaComponent', () => {
  let component: DocenciaComponent;
  let fixture: ComponentFixture<DocenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), DocenciaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
