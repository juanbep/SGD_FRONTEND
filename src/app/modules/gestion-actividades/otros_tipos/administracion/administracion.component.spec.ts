import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionComponent } from './administracion.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('AdministracionComponent', () => {
  let component: AdministracionComponent;
  let fixture: ComponentFixture<AdministracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        AdministracionComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
