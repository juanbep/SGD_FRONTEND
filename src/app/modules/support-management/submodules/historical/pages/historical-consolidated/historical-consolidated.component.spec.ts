import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalConsolidatedComponent } from './historical-consolidated.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('HistoricalConsolidatedComponent', () => {
  let component: HistoricalConsolidatedComponent;
  let fixture: ComponentFixture<HistoricalConsolidatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        HistoricalConsolidatedComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricalConsolidatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
