import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitiesComponent } from './activities.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import {  provideRouter, Routes } from '@angular/router';
import path from 'path';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ActivitiesComponent', () => {
  let component: ActivitiesComponent;
  let fixture: ComponentFixture<ActivitiesComponent>;

  beforeEach(async () => {
    const routes: Routes = [ {path: 'actividades-usuario/:id', component: ActivitiesComponent}]
    
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot(), ActivitiesComponent],
            providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])], 
      
      
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
