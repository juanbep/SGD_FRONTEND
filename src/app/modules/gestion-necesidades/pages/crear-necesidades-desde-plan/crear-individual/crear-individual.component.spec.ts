import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearIndividualComponent } from './crear-individual.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('CrearIndividualComponent', () => {
  let component: CrearIndividualComponent;
  let fixture: ComponentFixture<CrearIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
