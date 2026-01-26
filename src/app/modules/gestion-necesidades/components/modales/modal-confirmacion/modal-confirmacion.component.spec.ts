import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmacionComponent } from './modal-confirmacion.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ModalConfirmacionComponent', () => {
  let component: ModalConfirmacionComponent;
  let fixture: ComponentFixture<ModalConfirmacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        ModalConfirmacionComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalConfirmacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
