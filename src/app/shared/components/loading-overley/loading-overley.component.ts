import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-loading-overley',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './loading-overley.component.html',
  styleUrls: ['./loading-overley.component.css']
})
export class LoadingOverleyComponent {
  /** Propiedad que indica si debe mostrarse el overlay de carga */
  @Input() isLoading: boolean = false;
}
