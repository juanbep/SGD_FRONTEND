import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmGetInfoKiraComponent } from './modal-confirm-get-info-kira.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ModalConfirmGetInfoKiraComponent', () => {
  let component: ModalConfirmGetInfoKiraComponent;
  let fixture: ComponentFixture<ModalConfirmGetInfoKiraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
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
