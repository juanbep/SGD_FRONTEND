import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCarouselComponent } from './usuario-carousel.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('UsuarioCarouselComponent', () => {
  let component: UsuarioCarouselComponent;
  let fixture: ComponentFixture<UsuarioCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        UsuarioCarouselComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
