import { Component, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
@Component({
  selector: 'statistics-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnInit, OnChanges {

  @Input()
  labels: string[] = [];

  @Input()
  dataSets: any[] = [];

  chart: Chart | undefined;

  ngOnInit() {
    this.drawChart(this.labels, this.dataSets);
  }

  ngOnChanges(changes: SimpleChanges): void {
   if (changes['labels'] || changes['dataSets']) {
      this.labels = changes['labels'].currentValue;
      this.dataSets = changes['dataSets'].currentValue;
      if(this.chart){
        this.chart.destroy();
        this.drawChart(this.labels, this.dataSets);
      }
    }
  }

  downloadChart() {
    const link = document.createElement('a');
    link.href = this.chart?.toBase64Image() || '';
    link.download = 'chart.png';
    link.click();
  }

  drawChart(labels: string[], dataSets: any[]) {
    this.chart = new Chart('canvas-chart', {
      type: 'bar',
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

}
