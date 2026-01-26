import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionComponent } from './extension.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('ExtensionComponent', () => {
  let component: ExtensionComponent;
  let fixture: ComponentFixture<ExtensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot(), ExtensionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
