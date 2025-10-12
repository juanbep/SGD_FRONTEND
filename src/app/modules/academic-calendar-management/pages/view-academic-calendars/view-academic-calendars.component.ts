import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAcademicCalendarsComponent } from '../../components/list-academic-calendars/list-academic-calendars.component';

@Component({
  selector: 'app-view-academic-calendar',
  standalone: true,
  imports: [CommonModule, ListAcademicCalendarsComponent],
  templateUrl: './view-academic-calendars.component.html',
  styleUrl: './view-academic-calendars.component.css',
})
export class ViewAcademicCalendarsComponent {}
