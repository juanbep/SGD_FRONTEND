import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCarouselComponent } from './usuario-carousel.component';

describe('UsuarioCarouselComponent', () => {
  let component: UsuarioCarouselComponent;
  let fixture: ComponentFixture<UsuarioCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
