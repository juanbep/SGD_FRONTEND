import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCorrequisitosModalComponent } from './ver-correquisitos-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('VerCorrequisitosModalComponent', () => {
  let component: VerCorrequisitosModalComponent;
  let fixture: ComponentFixture<VerCorrequisitosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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
