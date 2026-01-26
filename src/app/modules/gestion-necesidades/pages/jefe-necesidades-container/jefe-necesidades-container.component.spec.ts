import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefeNecesidadesContainerComponent } from './jefe-necesidades-container.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('JefeNecesidadesContainerComponent', () => {
  let component: JefeNecesidadesContainerComponent;
  let fixture: ComponentFixture<JefeNecesidadesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        JefeNecesidadesContainerComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JefeNecesidadesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
