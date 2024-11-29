import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'shared-paginator',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 0;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  totalPagesArray: (number | string)[] = [];
  singlePage: boolean = false;

  constructor() { }

  ngOnChanges(): void {
    this.calculateTotalPagesArray();
    this.singlePage = this.totalPages === 1;
  }

  calculateTotalPagesArray(): void {
    const pagesToShow = 5;
    const total = this.totalPages;
    const current = this.currentPage;
    this.totalPagesArray = [];

    if (total <= pagesToShow) {
      this.totalPagesArray = Array.from({ length: total }, (_, index) => index + 1);
    } else {
      const half = Math.floor(pagesToShow / 2);

      if (current <= half + 1) {
        this.totalPagesArray = [1, 2, 3, '...', total];
      } else if (current >= total - half) {
        this.totalPagesArray = [1, '...', total - 2, total - 1, total];
      } else {
        this.totalPagesArray = [1, '...', current - 1, current, current + 1, '...', total];
      }
    }
  }

  changePage(page: number | string): void {
    if (typeof page === 'number') {
      this.pageChange.emit(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  goToFirstPage(): void {
    this.pageChange.emit(1);
  }

  goToLastPage(): void {
    this.pageChange.emit(this.totalPages);
  }

}
