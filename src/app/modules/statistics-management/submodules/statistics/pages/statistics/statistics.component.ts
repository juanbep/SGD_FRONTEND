import { Component } from '@angular/core';
import { ChartComponent } from "../../components/chart/chart.component";

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {

}
