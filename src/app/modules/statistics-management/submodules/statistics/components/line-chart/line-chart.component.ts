import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'statistics-line-chart',
  standalone: true,
  imports: [],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.css',
})
export class LineChartComponent implements OnInit, OnChanges {
  @Input()
  labels: string[] = [];

  @Input()
  dataSets: any[] = [];

  chart: Chart | undefined;

  ngOnInit() {
    this.drawLineChart(this.labels, this.dataSets);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['labels'] || changes['dataSets']) {
      this.labels = changes['labels'].currentValue;
      this.dataSets = changes['dataSets'].currentValue;
      if (this.chart) {
        this.chart.destroy();
        this.drawLineChart(this.labels, this.dataSets);
      }
    }
  }


  drawLineChart(labels: string[], dataSets: any[]) {
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: labels,
        datasets: dataSets,
      },
      options: {
        scales: {
          
          y: {
            beginAtZero: true,
            
          },
        },
      },
    });
  }

  downloadChart() {
    const link = document.createElement('a');
    link.href = this.chart?.toBase64Image() || '';
    link.download = 'chart.png';
    link.click();
  }
}
