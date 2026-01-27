import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCorrequisitosModalComponent } from './ver-correquisitos-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('VerCorrequisitosModalComponent', () => {
  let component: VerCorrequisitosModalComponent;
  let fixture: ComponentFixture<VerCorrequisitosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        VerCorrequisitosModalComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerCorrequisitosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
