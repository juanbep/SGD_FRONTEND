import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmGetInfoKiraComponent } from './modal-confirm-get-info-kira.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';

describe('ModalConfirmGetInfoKiraComponent', () => {
  let component: ModalConfirmGetInfoKiraComponent;
  let fixture: ComponentFixture<ModalConfirmGetInfoKiraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        RouterTestingModule,
        ModalConfirmGetInfoKiraComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalConfirmGetInfoKiraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
