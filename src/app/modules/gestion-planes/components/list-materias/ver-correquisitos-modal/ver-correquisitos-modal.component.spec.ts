import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerCorrequisitosModalComponent } from './ver-correquisitos-modal.component';

describe('VerCorrequisitosModalComponent', () => {
  let component: VerCorrequisitosModalComponent;
  let fixture: ComponentFixture<VerCorrequisitosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerCorrequisitosModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerCorrequisitosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
