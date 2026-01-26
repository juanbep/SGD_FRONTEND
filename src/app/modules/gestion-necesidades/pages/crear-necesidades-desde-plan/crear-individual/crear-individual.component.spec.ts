import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearIndividualComponent } from './crear-individual.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('CrearIndividualComponent', () => {
  let component: CrearIndividualComponent;
  let fixture: ComponentFixture<CrearIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        CrearIndividualComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CrearIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
